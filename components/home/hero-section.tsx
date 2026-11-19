import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  MapPinIcon,
  SearchIcon,
} from "lucide-react"

import heroBg from "@/app/Images/globe.png"

const TRENDING_ROLES = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      // Negative top margin = navbar height, so the glow sits behind the
      // floating navbar like in Figma. overflow-x-clip stops the wide image
      // from causing sideways scroll, but lets it continue downwards.
      className="relative isolate -mt-20 overflow-x-clip px-4 pt-40 pb-40 sm:px-6 sm:pt-48 lg:-mt-[98px] lg:pt-[274px] lg:pb-[286px]"
    >
      <Image
        src={heroBg}
        alt=""
        preload
        sizes="(min-width: 1024px) 1440px, 1100px"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-auto w-[1100px] max-w-none -translate-x-1/2 sm:w-[1300px] lg:w-[max(100%,1440px)]"
      />

      <div className="mx-auto flex max-w-[784px] flex-col items-center gap-10 text-center lg:gap-12">
        {/* Badge + heading + subtext */}
        <div className="flex flex-col items-center gap-6 lg:gap-8">
          <div className="flex items-center">
            <span
              aria-hidden
              className="hidden h-px w-16 bg-linear-to-r from-[#010123] to-[#a8a8a8] sm:block"
            />
            <p className="inline-flex items-center gap-3 rounded-3xl border border-white/20 bg-linear-to-b from-[#474747] to-[#010102] px-4 py-2 font-mono text-sm text-white shadow-[inset_0_2px_6px_rgb(255_255_255/0.15)] sm:gap-4 sm:px-6 sm:py-3 sm:text-lg lg:text-xl">
              <BriefcaseBusinessIcon
                aria-hidden
                className="size-5 text-[#bac8fa] sm:size-6"
              />
              50,000+ new jobs this month
            </p>
            <span
              aria-hidden
              className="hidden h-px w-16 bg-linear-to-r from-[#a8a8a8] to-[#010123] sm:block"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <h1
              id="hero-heading"
              className="text-4xl leading-[1.15] font-bold tracking-[-0.02em] text-white sm:text-5xl lg:text-[56px]"
            >
              Find Your Dream Job Today
            </h1>
            <p className="text-base leading-[1.6] text-white/70 sm:text-lg lg:text-xl">
              HireLoop connects top talent with world-class companies. Browse
              thousands of curated opportunities and land your next role —
              faster.
            </p>
          </div>
        </div>

        {/* Search + trending */}
        <div className="flex w-full flex-col items-center gap-6">
          {/* Plain HTML form: the browser goes to /jobs?q=…&location=…
              on submit, so no JavaScript is needed. */}
          <form
            action="/jobs"
            method="get"
            role="search"
            className="flex w-full flex-col gap-2 rounded-2xl border border-white/20 bg-[#101010] p-2 transition-colors focus-within:border-white/40 sm:h-16 sm:flex-row sm:items-center sm:gap-6 sm:py-2 sm:pr-2 sm:pl-6"
          >
            <label className="flex h-12 flex-1 items-center gap-2 px-3 sm:h-auto sm:px-0">
              <span className="sr-only">Job title, skill or company</span>
              <SearchIcon aria-hidden className="size-6 shrink-0 text-white" />
              <input
                type="search"
                name="q"
                placeholder="Job title, skill or company"
                className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/80"
              />
            </label>

            <span
              aria-hidden
              className="mx-3 h-px bg-white/20 sm:mx-0 sm:h-6 sm:w-px"
            />

            <label className="flex h-12 flex-1 items-center gap-2 px-3 sm:h-auto sm:px-0">
              <span className="sr-only">Location or Remote</span>
              <MapPinIcon aria-hidden className="size-6 shrink-0 text-white" />
              <input
                type="text"
                name="location"
                placeholder="Location or Remote"
                className="w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/80"
              />
            </label>

            <button
              type="submit"
              aria-label="Search jobs"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-base font-medium text-brand-foreground transition-colors hover:bg-brand/85 sm:size-12"
            >
              <SearchIcon aria-hidden className="size-6" />
              <span className="sm:hidden">Search</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <span className="text-base text-white/70">Trending Position</span>
            <ul className="flex flex-wrap justify-center gap-2">
              {TRENDING_ROLES.map((role) => (
                <li key={role}>
                  <Link
                    href={{ pathname: "/jobs", query: { q: role } }}
                    className="inline-flex rounded-3xl border border-white/10 bg-[#1a1a1b] px-3 py-1.5 text-sm text-white transition-colors hover:border-white/30"
                  >
                    {role}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirement: "Post a Job" CTA. Route not built yet. */}
          <p className="text-sm text-white/70">
            Hiring?{" "}
            <Link
              href="/dashboard/recruiter/jobs/new"
              className="inline-flex items-center gap-1 font-medium text-white underline-offset-4 transition-colors hover:text-brand hover:underline"
            >
              Post a job
              <ArrowRightIcon aria-hidden className="size-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
