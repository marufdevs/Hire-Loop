// "(auth)" is a route group: the brackets keep it out of the URL, so pages
// stay at /login and /register but share this layout.
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative isolate overflow-hidden px-4 py-12 sm:px-6 lg:py-20">
      {/* Soft purple glow behind the card, same colour as the CTA glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(50%_60%_at_50%_0%,rgb(92_83_254/0.35),transparent)]"
      />
      <main className="mx-auto w-full max-w-[440px]">{children}</main>
    </div>
  )
}
