"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Globe2,
  MapPin,
  Rocket,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { cn } from "cn"
import createJobs from "@/lib/actions/recruiter/createJobs"
import type { CreateJobPayload, CreateJobResult } from "@/lib/types/job"

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const

const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design & Creative",
  "Product Management",
  "Marketing & Growth",
  "Sales & Business",
  "Operations",
  "Finance & Accounting",
  "Human Resources",
  "Customer Support",
  "Other",
]

const SALARY_PERIODS = ["per hour", "per month", "per year"]

const fieldClass =
  "rounded-xl border-[#232327] bg-[#1e1e21] text-sm text-[#f4f4f5] placeholder:text-[#a0a0ab] transition-colors outline-none focus-visible:border-[#5c53fe] focus-visible:ring-3 focus-visible:ring-[#5c53fe]/30 dark:border-[#232327] dark:bg-[#1e1e21]"

const inputClass = cn(fieldClass, "h-11 px-4")

function Field({
  id,
  label,
  required,
  className,
  children,
}: {
  id?: string
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-[#f4f4f5]">
        {label}
        {required ? " *" : null}
      </Label>
      {children}
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-[#232327] bg-[#151516] p-4 sm:p-6">
      <header className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full bg-[#5c53fe]"
        />
        <h2 className="text-base font-medium text-white">{title}</h2>
      </header>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function IconInput({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { icon: LucideIcon }) {
  return (
    <div className="relative">
      <Icon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a0a0ab]"
      />
      <Input className={cn(inputClass, "pl-11", className)} {...props} />
    </div>
  )
}

function DateInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <IconInput
      icon={CalendarDays}
      type="date"
      className={cn("[color-scheme:dark]", className)}
      {...props}
    />
  )
}

function SelectInput({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-[#232327] bg-[#1e1e21] pr-10 pl-4 text-sm text-[#f4f4f5] transition-colors outline-none focus-visible:border-[#5c53fe] focus-visible:ring-3 focus-visible:ring-[#5c53fe]/30 [&>option]:bg-[#1e1e21]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-[#a0a0ab]"
      />
    </div>
  )
}
export function CreateJobForm() {
  const router = useRouter()
  const [jobType, setJobType] = React.useState<string>("full-time")
  const [isRemote, setIsRemote] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (pending) {
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      ...Object.fromEntries(formData.entries()),
      // Unchecked checkboxes are not submitted, so the key disappears when off.
      isRemote: formData.get("isRemote") === "on",
    } as CreateJobPayload

    setPending(true)

    const toastId = toast.add({
      title: "Publishing job…",
      description: "Saving your listing.",
      type: "loading",
      timeout: 0,
    })

    let result: CreateJobResult
    try {
      result = await createJobs(payload)
    } catch {
      result = { ok: false, error: "Something went wrong. Please try again." }
    }

    setPending(false)

    if (result.ok) {
      toast.update(toastId, {
        title: "Job published",
        description: "Your listing is now live.",
        type: "success",
        timeout: 4000,
      })
      form.reset()
      setJobType("full-time")
      setIsRemote(false)
      router.push("/dashboard/recruiter/jobs")
    } else {
      toast.update(toastId, {
        title: "Couldn't publish job",
        description: result.error,
        type: "error",
        timeout: 6000,
        priority: "high",
      })
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1040px] min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs font-medium"
            >
              <Link
                href="/dashboard/recruiter/jobs"
                className="text-[#a0a0ab] transition-colors hover:text-[#f4f4f5]"
              >
                Manage Jobs
              </Link>
              <ChevronRight
                aria-hidden
                className="size-3 shrink-0 text-[#5a5a60]"
              />
              <span className="text-[#c3c0ff]">Create New Listing</span>
            </nav>

            <h1 className="mt-4 text-2xl font-medium tracking-[-0.8px] text-white sm:text-[32px] sm:leading-[42px]">
              Post a New Job
            </h1>
            <p className="mt-2 max-w-[520px] text-[13px] leading-5 text-[#a0a0ab]">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
          </div>
        </div>

        <SectionCard title="1. Basic Information">
          <Field id="title" label="Job Title" required>
            <Input
              id="title"
              name="title"
              required
              placeholder="e.g. Frontend Developer"
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="company" label="Company Name" required>
              <IconInput
                icon={Building2}
                id="company"
                name="company"
                required
                placeholder="e.g. HirePulse Network"
              />
            </Field>

            <Field id="category" label="Job Category" required>
              <SelectInput
                id="category"
                name="category"
                required
                defaultValue="Engineering & Tech"
              >
                {JOB_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <div className="space-y-1.5">
            <span
              id="job-type-label"
              className="block text-sm font-medium text-[#f4f4f5]"
            >
              Job Type *
            </span>
            <div
              role="radiogroup"
              aria-labelledby="job-type-label"
              className="grid grid-cols-2 gap-1 sm:grid-cols-4"
            >
              {JOB_TYPES.map((type) => {
                const selected = jobType === type.value
                return (
                  <button
                    key={type.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setJobType(type.value)}
                    className={cn(
                      "h-11 rounded-xl border text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/30",
                      selected
                        ? "border-[#5c53fe]/50 bg-[#232327] text-white"
                        : "border-transparent bg-[#1e1e21] text-[#a0a0ab] hover:bg-[#232327] hover:text-[#f4f4f5]"
                    )}
                  >
                    {type.label}
                  </button>
                )
              })}
            </div>
            <input type="hidden" name="jobType" value={jobType} />
          </div>
        </SectionCard>

        <SectionCard title="2. Location, Compensation & Timeline">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-[#232327] bg-[#1e1e21] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#232327] text-[#c3c0ff]">
                <Globe2 aria-hidden className="size-5" />
              </span>
              <div className="min-w-0">
                <p
                  id="is-remote-label"
                  className="text-sm font-medium text-white"
                >
                  Remote Work Allowed
                </p>
                <p className="text-[13px] leading-5 text-[#a0a0ab]">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <Switch
              id="isRemote"
              name="isRemote"
              aria-labelledby="is-remote-label"
              checked={isRemote}
              onCheckedChange={setIsRemote}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="location" label="Job Location" required>
              <IconInput
                icon={MapPin}
                id="location"
                name="location"
                required
                placeholder="e.g. New York, USA"
              />
            </Field>

            <Field id="deadline" label="Application Deadline">
              <DateInput id="deadline" name="deadline" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field id="minSalary" label="Min Salary / Rate">
              <IconInput
                icon={DollarSign}
                id="minSalary"
                name="minSalary"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="25"
              />
            </Field>

            <Field id="maxSalary" label="Max Salary / Rate">
              <IconInput
                icon={DollarSign}
                id="maxSalary"
                name="maxSalary"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="40"
              />
            </Field>

            <Field id="salaryPeriod" label="Frequency">
              <SelectInput
                id="salaryPeriod"
                name="salaryPeriod"
                defaultValue="per hour"
              >
                {SALARY_PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
        </SectionCard>

        <SectionCard title="3. Responsibilities & Requirements">
          <Field id="responsibilities" label="Key Responsibilities" required>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              required
              placeholder="Describe the day-to-day responsibilities, team collaboration, and impact of this role."
              className={cn(
                fieldClass,
                "min-h-[98px] resize-y px-4 py-3 leading-[22px]"
              )}
            />
          </Field>

          <Field
            id="qualifications"
            label="Qualifications & Requirements"
            required
          >
            <Textarea
              id="qualifications"
              name="qualifications"
              required
              placeholder="List the required experience, skills, and qualifications — one per line."
              className={cn(
                fieldClass,
                "min-h-[98px] resize-y px-4 py-3 leading-[22px]"
              )}
            />
          </Field>
        </SectionCard>
        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full shrink-0 rounded-xl bg-[#5c53fe] px-6 text-sm font-medium text-white shadow-[0_8px_22px_-8px_rgba(92,83,254,0.9)] hover:bg-[#4b43e0] sm:w-auto"
        >
          {pending ? "Publishing…" : "Publish Job"}
          {!pending && <Rocket aria-hidden className="size-4" />}
        </Button>
      </form>
    </div>
  )
}
