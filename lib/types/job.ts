export type CreateJobPayload = {
  category: string
  company: string
  deadline: string
  isRemote: boolean
  jobType: string
  location: string
  maxSalary: string
  minSalary: string
  qualifications: string
  responsibilities: string
  salaryPeriod: string
  title: string
}

export type CreateJobResult =
  | { ok: true }
  | { ok: false; error: string }

export type JobRecord = {
  id: string
  title: string
  company: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryPeriod: string
  responsibilities: string
  qualifications: string
  createdAt: string | null
}

export type DeleteJobResult = { ok: true } | { ok: false; error: string }
