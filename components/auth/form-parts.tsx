import { LoaderCircleIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const authInputClass =
  "h-12 rounded-xl border-border bg-background px-4 text-base md:text-base focus-visible:border-brand focus-visible:ring-brand/30 dark:border-white/15 dark:bg-[#101010]"

function fieldA11y(id: string, error?: string, hint?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
}

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}


function Field({ id, label, error, hint, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}


function SubmitButton({
  pending,
  children,
}: {
  pending: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-base font-medium text-brand-foreground transition-colors outline-none hover:bg-brand/85 focus-visible:ring-3 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-70",
        "shadow-[inset_0_3px_10px_rgb(255_255_255/0.2)]"
      )}
    >
      {pending && (
        <LoaderCircleIcon aria-hidden className="size-5 animate-spin" />
      )}
      {children}
    </button>
  )
}


function FormNotice({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-foreground"
    >
      {children}
    </p>
  )
}

export { authInputClass, Field, fieldA11y, FormNotice, SubmitButton }
