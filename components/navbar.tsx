"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
] as const

// Inner white glow used on the Figma buttons
const buttonGlow = "shadow-[inset_0_3px_10px_rgb(255_255_255/0.2)]"

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)

  React.useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 px-4 sm:px-6",
        isHome
          ? "pt-4 lg:pt-6"
          : "bg-background/80 py-3 backdrop-blur-md lg:py-4"
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex items-center justify-between gap-4",
          isHome
            ? "h-16 max-w-[1320px] rounded-2xl bg-nav pr-2 pl-4 lg:h-[74px] lg:pr-0 lg:pl-6"
            : "h-16 max-w-[1280px] lg:h-[68px]"
        )}
      >
        <Link href="/" onClick={close} className="shrink-0">
          <Image
            src="/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            loading="eager"
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        {/* Desktop */}
        <div
          className={cn(
            "hidden items-center gap-6 lg:flex",
            isHome
              ? "h-full rounded-2xl bg-nav px-8"
              : "h-full rounded-lg border border-nav-border bg-nav-pill px-6 shadow-[0_1px_2px_rgb(0_0_0/0.28)]"
          )}
        >
          <ul className={cn("flex items-center", isHome ? "gap-10" : "gap-5")}>
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-base leading-[1.8] tracking-[-0.2px] text-nav-foreground transition-colors hover:text-brand",
                      active && "font-bold"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <span aria-hidden className="h-6 w-px bg-nav-divider" />

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center px-6 text-lg font-semibold text-brand transition-opacity hover:opacity-80",
                isHome ? "h-[58px] rounded-xl" : "h-[38px] rounded-lg px-4",
                buttonGlow
              )}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={cn(
                "inline-flex h-[52px] items-center justify-center border border-[rgb(9_10_21/0.1)] bg-brand px-6 text-lg font-medium text-brand-foreground transition-colors hover:bg-brand/85",
                isHome ? "rounded-xl" : "rounded-lg",
                buttonGlow
              )}
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-nav-border bg-nav-pill text-nav-foreground lg:hidden"
        >
          {open ? (
            <XIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="mx-auto mt-2 max-w-[1320px] rounded-2xl border border-nav-border bg-nav-pill p-4 shadow-lg lg:hidden"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-3 text-base tracking-[-0.2px] text-nav-foreground transition-colors hover:bg-nav-border",
                    active && "bg-nav-border font-bold"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="my-3 h-px bg-nav-border" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/login"
            onClick={close}
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-xl border border-nav-border text-base font-semibold text-brand",
              buttonGlow
            )}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={close}
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-xl bg-brand text-base font-medium text-brand-foreground",
              buttonGlow
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
