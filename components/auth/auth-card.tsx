type AuthCardProps = {
  title: string
  description: string
  children: React.ReactNode
  /** Line under the form, e.g. "New here? Create an account" */
  footer: React.ReactNode
}

function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-nav-border bg-footer p-6 shadow-xl sm:p-8">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {children}

      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  )
}

export { AuthCard }
