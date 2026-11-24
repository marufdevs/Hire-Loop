"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const buttonGlow = "shadow-[inset_0_3px_10px_rgb(255_255_255/0.2)]"

function NavbarButtons({ isHome }: { isHome: boolean }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [signingOut, setSigningOut] = React.useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await authClient.signOut()
      router.refresh()
    } catch {
      // Stay signed in; the button becomes clickable again below.
    } finally {
      setSigningOut(false)
    }
  }

  // Avoid flashing the signed-out buttons while the session loads.
  if (isPending) {
    return (
      <div
        aria-hidden
        className={cn(
          "animate-pulse rounded-xl bg-nav-border",
          isHome ? "h-[52px] w-48" : "h-[38px] w-44"
        )}
      />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="max-w-40 truncate text-base font-medium text-nav-foreground">
          {session.user.name || session.user.email}
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border border-nav-border px-4 text-base font-semibold text-brand transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60",
            isHome ? "h-[58px]" : "h-[38px]"
          )}
        >
          <LogOutIcon aria-hidden className="size-4" />
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    )
  }

  return (
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
  )
}

export { NavbarButtons }
