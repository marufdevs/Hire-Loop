"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-[#1f1f1f] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-[#5c53fe]/40 disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-[#5c53fe]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-5 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-[22px] data-unchecked:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
