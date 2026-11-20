export type FieldErrors = Record<string, string>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(email: string) {
  if (!email) return "Enter your email"
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address"
}

export function validatePassword(password: string) {
  if (!password) return "Enter your password"
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
}

export function validateName(name: string) {
  if (!name) return "Enter your full name"
  if (name.length < 2) return "Name must be at least 2 characters"
}

/** Optional field: only checked when something is typed */
export function validatePhotoUrl(url: string) {
  if (!url) return
  try {
    const { protocol } = new URL(url)
    if (protocol !== "http:" && protocol !== "https:") throw new Error()
  } catch {
    return "Enter a valid URL starting with http:// or https://"
  }
}

/** Removes empty entries so the result only holds real errors */
export function collectErrors(errors: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(errors).filter((entry): entry is [string, string] =>
      Boolean(entry[1])
    )
  )
}
