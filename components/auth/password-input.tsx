"use client"

import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { authInputClass } from "@/components/auth/form-parts"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn(authInputClass, "pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-brand/30"
      >
        {visible ? (
          <EyeOffIcon aria-hidden className="size-5" />
        ) : (
          <EyeIcon aria-hidden className="size-5" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
