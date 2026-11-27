import type { JobRecord } from "@/lib/types/job"

const base_Url = process.env.NEXT_PUBLIC_URL

type RawJob = {
  _id: string
  title?: unknown
  company?: unknown
  category?: unknown
  jobType?: unknown
  isRemote?: unknown
  location?: unknown
  deadline?: unknown
  minSalary?: unknown
  maxSalary?: unknown
  salaryPeriod?: unknown
  responsibilities?: unknown
  qualifications?: unknown
  createdAt?: unknown
}

const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

/**
 * Documents created before `createdAt` was stored can still be dated: the
 * first 4 bytes of a MongoDB ObjectId are the creation timestamp in seconds.
 */
function createdAtFromId(id: string): string | null {
  const seconds = Number.parseInt(id.slice(0, 8), 16)

  return Number.isFinite(seconds) ? new Date(seconds * 1000).toISOString() : null
}

function toJobRecord(raw: RawJob): JobRecord {
  return {
    id: raw._id,
    title: text(raw.title) || "Untitled role",
    company: text(raw.company) || "Unknown company",
    category: text(raw.category) || "Uncategorized",
    jobType: text(raw.jobType) || "full-time",
    isRemote: raw.isRemote === "on" || raw.isRemote === true,
    location: text(raw.location),
    deadline: text(raw.deadline),
    minSalary: text(raw.minSalary),
    maxSalary: text(raw.maxSalary),
    salaryPeriod: text(raw.salaryPeriod),
    responsibilities: text(raw.responsibilities),
    qualifications: text(raw.qualifications),
    createdAt: text(raw.createdAt) || createdAtFromId(raw._id),
  }
}

export async function getJobs(): Promise<JobRecord[]> {
  const res = await fetch(`${base_Url}/jobs`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`)
  }

  const data = (await res.json()) as RawJob[]

  return data.map(toJobRecord)
}
