"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2Icon, ShieldCheckIcon, UserIcon } from "lucide-react"

import {
  authInputClass,
  Field,
  fieldA11y,
  FormNotice,
  SubmitButton,
} from "@/components/auth/form-parts"
import { PasswordInput } from "@/components/auth/password-input"
import {
  collectErrors,
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateName,
  validatePassword,
  validatePhotoUrl,
  type FieldErrors,
} from "@/components/auth/validation"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { parseRole, type Role } from "@/lib/roles"

type RoleOption = {
  value: Role
  label: string
  description: string
  icon: typeof UserIcon
}

const ROLES: readonly RoleOption[] = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Find and apply for jobs",
    icon: UserIcon,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and hire talent",
    icon: Building2Icon,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the platform",
    icon: ShieldCheckIcon,
  },
]

const PASSWORD_HINT = `At least ${MIN_PASSWORD_LENGTH} characters`

function RegisterForm({ defaultRole }: { defaultRole: Role }) {
  const router = useRouter()
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [pending, setPending] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const role = parseRole(data.get("role"))
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const photoUrl = String(data.get("photoUrl") ?? "").trim()
    const password = String(data.get("password") ?? "")

    const nextErrors = collectErrors({
      name: validateName(name),
      email: validateEmail(email),
      photoUrl: validatePhotoUrl(photoUrl),
      password: validatePassword(password),
    })
    setErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl || undefined,
        role,
        callbackURL: "/",
      })

      if (error) {
        const code: string | undefined = error.code

        if (
          code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
          code === "USER_ALREADY_EXISTS"
        ) {
          setErrors({ email: "An account with this email already exists" })
        } else if (code === "INVALID_EMAIL") {
          setErrors({ email: "Enter a valid email address" })
        } else if (code === "PASSWORD_TOO_SHORT") {
          setErrors({
            password: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
          })
        } else {
          setFormError(
            error.message || "We couldn't create your account. Please try again."
          )
        }
        return
      }

      // Signup also creates a session, so take the user straight home.
      router.push("/")
      router.refresh()
    } catch {
      setFormError("Something went wrong. Check your connection and try again.")
    } finally {
      setPending(false)
    }
  }

  // Clear a field's error as soon as the user edits it
  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    const { name } = event.target as HTMLInputElement
    if (!errors[name]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="flex flex-col gap-5"
    >
      {/* Role picker: real radio buttons styled as cards */}
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">I want to</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon
            return (
              <label
                key={role.value}
                className="flex cursor-pointer flex-col gap-2 rounded-xl border border-border p-3 transition-colors has-checked:border-brand has-checked:bg-brand/10 has-focus-visible:ring-3 has-focus-visible:ring-brand/30 sm:p-4 dark:border-white/15"
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  defaultChecked={role.value === defaultRole}
                  className="sr-only"
                />
                <Icon aria-hidden className="size-5 text-brand" />
                <span className="text-sm font-semibold sm:text-base">
                  {role.label}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {role.description}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field id="name" label="Full name" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Jane Doe"
          className={authInputClass}
          {...fieldA11y("name", errors.name)}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={authInputClass}
          {...fieldA11y("email", errors.email)}
        />
      </Field>

      <Field id="photoUrl" label="Photo URL" optional error={errors.photoUrl}>
        <Input
          id="photoUrl"
          name="photoUrl"
          type="url"
          autoComplete="photo"
          placeholder="https://…"
          className={authInputClass}
          {...fieldA11y("photoUrl", errors.photoUrl)}
        />
      </Field>

      <Field
        id="password"
        label="Password"
        error={errors.password}
        hint={PASSWORD_HINT}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          {...fieldA11y("password", errors.password, PASSWORD_HINT)}
        />
      </Field>

      {formError && <FormNotice variant="error">{formError}</FormNotice>}

      <SubmitButton pending={pending}>
        {pending ? "Creating account…" : "Create account"}
      </SubmitButton>

      <p className="text-center text-xs text-muted-foreground">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  )
}

export { RegisterForm }
