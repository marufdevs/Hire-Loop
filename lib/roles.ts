export const ROLE_VALUES = ["seeker", "recruiter", "admin"] as const

export type Role = (typeof ROLE_VALUES)[number]

export function parseRole(value: unknown): Role {
  return typeof value === "string" &&
    (ROLE_VALUES as readonly string[]).includes(value)
    ? (value as Role)
    : "seeker"
}
