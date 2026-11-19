import Image from "next/image"
import Link from "next/link"

import ctaBg from "@/app/Images/cta-bg.png"
import { cn } from "@/lib/utils"

const buttonGlow = "shadow-[inset_0_3px_10px_rgb(255_255_255/0.2)]"

const purpleGlow =
  "radial-gradient(var(--glow) at 50% 0%, #5c53fe 0%, rgb(92 83 254 / 0.6) 29%, rgb(92 83 254 / 0.5) 52%, transparent 100%)"

function CtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate -mb-[200px] overflow-hidden bg-[#010103] px-4 pt-24 pb-[296px] [--glow:340px_260px] sm:px-6 sm:[--glow:480px_340px] lg:-mb-[385px] lg:pt-[153px] lg:pb-[503px] lg:[--glow:640px_443px]"
      style={{ backgroundImage: purpleGlow }}
    >
      <Image
        src={ctaBg}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />

      <div className="mx-auto flex max-w-[792px] flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2
            id="cta-heading"
            className="text-4xl leading-[1.2] font-medium tracking-[-1.5px] text-white sm:text-5xl lg:text-[64px]"
          >
            Your next role is <br className="hidden md:block" />
            already looking for you
          </h2>
          <p className="text-base leading-[1.6] text-white/70 sm:text-lg lg:text-xl">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/register"
            className={cn(
              "inline-flex h-[58px] items-center justify-center rounded-xl border border-[rgb(9_10_21/0.1)] bg-white px-6 text-lg font-semibold text-[#0b0b14] transition-colors hover:bg-white/90",
              buttonGlow
            )}
          >
            Create a free account
          </Link>
          <Link
            href="/pricing"
            className={cn(
              "inline-flex h-[58px] items-center justify-center rounded-xl border border-[rgb(215_215_215/0.3)] bg-[#0e0b16] px-6 text-lg font-medium text-white transition-colors hover:border-white/50",
              buttonGlow
            )}
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  )
}

export { CtaSection }
