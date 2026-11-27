"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Eye,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"
import deleteJob from "@/lib/actions/recruiter/deleteJob"
import type { JobRecord } from "@/lib/types/job"

const SALARY_SUFFIX: Record<string, string> = {
  "per hour": "/ hr",
  "per month": "/ mo",
  "per year": "/ yr",
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatJobType(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-")
}

function compactNumber(value: string) {
  if (!value) {
    return ""
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return value
  }

  if (amount >= 1000) {
    const thousands = (amount / 1000).toLocaleString("en-US", {
      maximumFractionDigits: 1,
    })

    return `${thousands}k`
  }

  return amount.toLocaleString("en-US")
}

function formatCompensation(job: JobRecord) {
  const min = compactNumber(job.minSalary)
  const max = compactNumber(job.maxSalary)
  const suffix = SALARY_SUFFIX[job.salaryPeriod] ?? ""

  if (min && max) {
    return `${min} – ${max} ${suffix}`.trim()
  }

  if (min || max) {
    return `${min || max} ${suffix}`.trim()
  }

  return "Not specified"
}

function locationLabel(job: JobRecord) {
  if (!job.location) {
    return job.isRemote ? "Remote" : "Not specified"
  }

  if (!job.isRemote) {
    return job.location
  }

  // Some listings already store the arrangement in the location, e.g.
  // "Remote - Worldwide" — don't repeat the prefix.
  return /^remote\b/i.test(job.location) ? job.location : `Remote (${job.location})`
}

function formatDeadline(value: string) {
  if (!value) {
    return "No deadline"
  }

  const date = new Date(`${value}T00:00:00`)

  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

function isExpired(job: JobRecord) {
  if (!job.deadline) {
    return false
  }

  const deadline = new Date(`${job.deadline}T23:59:59`)

  return !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()
}

function formatPostedAt(value: string | null) {
  if (!value) {
    return ""
  }

  const posted = new Date(value).getTime()

  if (Number.isNaN(posted)) {
    return ""
  }

  const days = Math.max(0, Math.floor((Date.now() - posted) / 86_400_000))

  if (days === 0) return "Posted today"
  if (days === 1) return "Posted 1d ago"
  if (days < 7) return `Posted ${days}d ago`
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`

  return `Posted ${Math.floor(days / 30)}mo ago`
}

function TypeBadge({ job }: { job: JobRecord }) {
  return (
    <span className="inline-flex rounded-lg border border-[#232327] bg-[#1e1e21] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[#f4f4f5]">
      {formatJobType(job.jobType)}
    </span>
  )
}

function StatusBadge({ job }: { job: JobRecord }) {
  const expired = isExpired(job)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        expired
          ? "border-red-500/25 bg-red-500/10 text-red-300"
          : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          expired ? "bg-red-400" : "bg-emerald-400"
        )}
      />
      {expired ? "Expired" : "Active"}
    </span>
  )
}

function JobActions({
  job,
  onView,
  onDelete,
}: {
  job: JobRecord
  onView: (job: JobRecord) => void
  onDelete: (job: JobRecord) => void
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`View ${job.title}`}
        className="text-[#a0a0ab] hover:bg-[#232327] hover:text-white"
        onClick={() => onView(job)}
      >
        <Eye className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete ${job.title}`}
        className="text-[#a0a0ab] hover:bg-red-500/10 hover:text-red-300"
        onClick={() => onDelete(job)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[#a0a0ab]">{label}</dt>
      <dd className="mt-1 text-sm text-[#f4f4f5]">{value}</dd>
    </div>
  )
}

export function JobsTable({
  jobs,
  error,
}: {
  jobs: JobRecord[]
  error?: string | null
}) {
  const router = useRouter()
  const [selected, setSelected] = React.useState<JobRecord | null>(null)
  const [jobToDelete, setJobToDelete] = React.useState<JobRecord | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  async function handleDelete() {
    if (!jobToDelete || deleting) {
      return
    }

    const target = jobToDelete
    setDeleting(true)

    const toastId = toast.add({
      title: "Deleting job…",
      description: target.title,
      type: "loading",
      timeout: 0,
    })

    let result: Awaited<ReturnType<typeof deleteJob>>
    try {
      result = await deleteJob(target.id)
    } catch {
      result = { ok: false, error: "Something went wrong. Please try again." }
    }

    setDeleting(false)

    if (result.ok) {
      toast.update(toastId, {
        title: "Job deleted",
        description: `“${target.title}” was removed.`,
        type: "success",
        timeout: 4000,
      })
      setJobToDelete(null)
      setSelected((current) => (current?.id === target.id ? null : current))
      router.refresh()
    } else {
      toast.update(toastId, {
        title: "Couldn't delete job",
        description: result.error,
        type: "error",
        timeout: 6000,
        priority: "high",
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium"
          >
            <span className="text-[#a0a0ab]">Manage Jobs</span>
            <ChevronRight
              aria-hidden
              className="size-3 shrink-0 text-[#5a5a60]"
            />
            <span className="text-[#c3c0ff]">Job Listings &amp; Postings</span>
          </nav>

          <h1 className="mt-4 text-2xl font-medium tracking-[-0.8px] text-white sm:text-[32px] sm:leading-[42px]">
            Manage Job Posts
          </h1>
          <p className="mt-2 max-w-[560px] text-[13px] leading-5 text-[#a0a0ab]">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/recruiter/jobs/new" />}
          nativeButton={false}
          className="h-11 w-full shrink-0 rounded-xl bg-[#5c53fe] px-6 text-sm font-medium text-white shadow-[0_8px_22px_-8px_rgba(92,83,254,0.9)] hover:bg-[#4b43e0] sm:w-auto"
        >
          <Plus aria-hidden className="size-4" />
          New Job Post
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          Couldn&apos;t load job posts. {error}
        </div>
      ) : null}

      {jobs.length === 0 && !error ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#232327] bg-[#151516] px-6 py-16 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#232327] text-[#c3c0ff]">
            <BriefcaseBusiness aria-hidden className="size-6" />
          </span>
          <h2 className="mt-4 text-base font-medium text-white">
            No job posts yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#a0a0ab]">
            Publish your first listing and it will show up here with its
            applicants and status.
          </p>
          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            nativeButton={false}
            className="mt-5 h-10 rounded-xl bg-[#5c53fe] px-5 text-sm font-medium text-white hover:bg-[#4b43e0]"
          >
            <Plus aria-hidden className="size-4" />
            Post a Job
          </Button>
        </div>
      ) : null}

      {jobs.length > 0 ? (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#232327] bg-[#151516] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#232327] text-[11px] font-medium tracking-[0.08em] text-[#a0a0ab] uppercase">
                    <th className="px-5 py-3.5 font-medium">Job Title &amp; Dept</th>
                    <th className="px-5 py-3.5 font-medium">Company &amp; Location</th>
                    <th className="px-5 py-3.5 font-medium">Type</th>
                    <th className="px-5 py-3.5 font-medium">Compensation</th>
                    <th className="px-5 py-3.5 font-medium">Applicants</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Deadline</th>
                    <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-[#232327]/70 transition-colors last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">
                          {job.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#a0a0ab]">
                          {job.category}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#f4f4f5]">{job.company}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#a0a0ab]">
                          <MapPin aria-hidden className="size-3.5 shrink-0" />
                          {locationLabel(job)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <TypeBadge job={job} />
                      </td>
                      <td className="px-5 py-4 text-sm whitespace-nowrap text-[#f4f4f5]">
                        {formatCompensation(job)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm text-[#a0a0ab]">
                          <Users aria-hidden className="size-4 shrink-0" />0
                          Candidates
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge job={job} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="flex items-center gap-1.5 text-sm text-[#f4f4f5]">
                          <CalendarDays
                            aria-hidden
                            className="size-3.5 shrink-0 text-[#a0a0ab]"
                          />
                          {formatDeadline(job.deadline)}
                        </p>
                        {job.createdAt ? (
                          <p className="mt-0.5 text-xs text-[#a0a0ab]">
                            {formatPostedAt(job.createdAt)}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <JobActions
                          job={job}
                          onView={setSelected}
                          onDelete={setJobToDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile / tablet cards */}
          <ul className="mt-6 grid gap-3 lg:hidden">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-2xl border border-[#232327] bg-[#151516] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {job.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[#a0a0ab]">
                      {job.category}
                    </p>
                  </div>
                  <StatusBadge job={job} />
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <DetailRow label="Company" value={job.company} />
                  <DetailRow
                    label="Location"
                    value={
                      <span className="flex items-center gap-1.5">
                        <MapPin aria-hidden className="size-3.5 shrink-0" />
                        <span className="truncate">{locationLabel(job)}</span>
                      </span>
                    }
                  />
                  <DetailRow
                    label="Compensation"
                    value={formatCompensation(job)}
                  />
                  <DetailRow
                    label="Deadline"
                    value={formatDeadline(job.deadline)}
                  />
                </dl>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#232327] pt-3">
                  <div className="flex items-center gap-2">
                    <TypeBadge job={job} />
                    <span className="flex items-center gap-1 text-xs text-[#a0a0ab]">
                      <Users aria-hidden className="size-3.5" />0
                    </span>
                  </div>
                  <JobActions
                    job={job}
                    onView={setSelected}
                    onDelete={setJobToDelete}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full border-[#232327] bg-[#151516] p-0 text-[#f4f4f5] data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        >
          {selected ? (
            <>
              <SheetHeader className="border-b border-[#232327] px-5 py-4 pr-12">
                <SheetTitle className="text-lg font-medium text-white">
                  {selected.title}
                </SheetTitle>
                <SheetDescription className="text-sm text-[#a0a0ab]">
                  {selected.company} · {selected.category}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge job={selected} />
                  <TypeBadge job={selected} />
                  <span className="rounded-full border border-[#232327] bg-[#1e1e21] px-2.5 py-1 text-xs text-[#c3c0ff]">
                    {selected.isRemote ? "Remote allowed" : "On-site"}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="Compensation"
                    value={formatCompensation(selected)}
                  />
                  <DetailRow
                    label="Deadline"
                    value={formatDeadline(selected.deadline)}
                  />
                  <DetailRow label="Location" value={locationLabel(selected)} />
                  <DetailRow
                    label="Posted"
                    value={formatPostedAt(selected.createdAt) || "—"}
                  />
                </dl>

                <div>
                  <h3 className="text-xs tracking-[0.08em] text-[#a0a0ab] uppercase">
                    Key responsibilities
                  </h3>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-line text-[#d4d4d8]">
                    {selected.responsibilities || "Not provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs tracking-[0.08em] text-[#a0a0ab] uppercase">
                    Qualifications &amp; requirements
                  </h3>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-line text-[#d4d4d8]">
                    {selected.qualifications || "Not provided."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#232327] px-5 py-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#a0a0ab] hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => setJobToDelete(selected)}
                >
                  <Trash2 aria-hidden className="size-4" />
                  Delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#232327] bg-transparent text-[#f4f4f5] hover:bg-[#232327]"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialogPrimitive.Root
        open={jobToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setJobToDelete(null)
          }
        }}
      >
        <AlertDialogPrimitive.Portal>
          <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60" />
          <AlertDialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#232327] bg-[#151516] p-5 text-[#f4f4f5] shadow-xl">
            <AlertDialogPrimitive.Title className="text-base font-medium text-white">
              Delete job post?
            </AlertDialogPrimitive.Title>
            <AlertDialogPrimitive.Description className="mt-2 text-sm leading-6 text-[#a0a0ab]">
              “{jobToDelete?.title}” will be permanently removed. This cannot be
              undone.
            </AlertDialogPrimitive.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialogPrimitive.Close
                render={
                  <Button
                    variant="outline"
                    className="border-[#232327] bg-transparent text-[#f4f4f5] hover:bg-[#232327]"
                  />
                }
              >
                Cancel
              </AlertDialogPrimitive.Close>
              <Button
                type="button"
                variant="destructive"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </AlertDialogPrimitive.Popup>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    </div>
  )
}
