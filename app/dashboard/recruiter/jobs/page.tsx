import { JobsTable } from "@/app/components/recruiter/jobs-table"
import { getJobs } from "@/lib/server/jobs"
import type { JobRecord } from "@/lib/types/job"

export const dynamic = "force-dynamic"

const ManageJobs = async () => {
  let jobs: JobRecord[] = []
  let error: string | null = null

  try {
    jobs = await getJobs()
  } catch (cause) {
    error =
      cause instanceof Error ? cause.message : "Unexpected error while loading."
  }

  return <JobsTable jobs={jobs} error={error} />
}

export default ManageJobs
