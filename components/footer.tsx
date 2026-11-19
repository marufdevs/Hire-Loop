import Image from "next/image"
import Link from "next/link"

const FOOTER_COLUMNS = [
  {
    title: "Job Seekers",
    links: [
      { label: "Browse Jobs", href: "/jobs" },
      { label: "Companies", href: "/companies" },
      { label: "Seeker Plans", href: "/pricing" },
      { label: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "Post a Job", href: "/dashboard/recruiter/jobs/new" },
      { label: "Register Company", href: "/dashboard/recruiter/company" },
      { label: "Recruiter Plans", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
] as const

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.56-.14-2.86-.14C11.92 2 10 3.66 10 6.7v2.8H7v4h3V22h4z",
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    path: "M12 2a10 10 0 0 0-3.64 19.31c-.09-.79-.17-2 .03-2.86l1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.88 3.15-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.78.74 2.28a.3.3 0 0 1 .07.29l-.28 1.13c-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.3-6.06 6.62-6.06 3.47 0 6.17 2.47 6.17 5.78 0 3.45-2.18 6.23-5.2 6.23-1.01 0-1.97-.53-2.29-1.15l-.62 2.38c-.23.87-.84 1.96-1.25 2.62A10 10 0 1 0 12 2",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z",
  },
] as const

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-[1320px] rounded-2xl bg-footer px-6 py-10 sm:px-10">
        {/* Top: brand + link columns */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex max-w-[288px] flex-col gap-6">
            <Link href="/" className="w-fit">
              <Image
                src="/logo.png"
                alt="HireLoop"
                width={154}
                height={44}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-base leading-[1.9] text-footer-foreground">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:gap-x-[72px]">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-6">
                <h2 className="text-lg leading-[1.4] font-medium text-brand">
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-base leading-[1.9] text-footer-foreground transition-colors hover:text-brand"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: socials + copyright */}
        <div className="mt-[72px] flex flex-col-reverse items-center gap-6 lg:flex-row lg:justify-between">
          <ul className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-lg bg-footer-social text-footer-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    className="size-5"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-2 text-center text-base leading-[1.9] text-footer-muted sm:flex-row sm:gap-6">
            <p>Copyright © {year} — HireLoop</p>
            <p>
              <Link href="/terms" className="transition-colors hover:text-brand">
                Terms &amp; Policy
              </Link>
              {" - "}
              <Link
                href="/privacy"
                className="transition-colors hover:text-brand"
              >
                Privacy Guideline
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
