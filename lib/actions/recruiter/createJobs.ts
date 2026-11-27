"use server"

import type { CreateJobPayload, CreateJobResult } from "@/lib/types/job"

const base_Url = process.env.NEXT_PUBLIC_URL

const createJobs = async (body: CreateJobPayload): Promise<CreateJobResult> => {
  try {
    const res = await fetch(`${base_Url}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")

      return {
        ok: false,
        error: detail || `Request failed (${res.status})`,
      }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: "Could not reach the jobs service." }
  }
}

export default createJobs
