const rows = Array.from({ length: 6 }, (_, index) => index)

const ManageJobsLoading = () => {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-[1200px] min-w-0 animate-pulse px-4 py-6 sm:px-6 lg:px-8 lg:py-10"
    >
      <span className="sr-only">Loading job posts…</span>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="h-3 w-40 rounded bg-[#232327]" />
          <div className="mt-4 h-8 w-64 rounded-lg bg-[#232327]" />
          <div className="mt-3 h-3 w-full max-w-[420px] rounded bg-[#232327]" />
          <div className="mt-2 h-3 w-2/3 max-w-[300px] rounded bg-[#232327]" />
        </div>
        <div className="h-11 w-full rounded-xl bg-[#232327] sm:w-36" />
      </div>

      {/* Desktop table placeholder */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#232327] bg-[#151516] lg:block">
        <div className="flex gap-4 border-b border-[#232327] px-5 py-3.5">
          {[
            "w-32",
            "w-36",
            "w-16",
            "w-24",
            "w-20",
            "w-16",
            "w-20",
            "w-12",
          ].map((width, index) => (
            <div
              key={index}
              className={`h-3 ${width} rounded bg-[#232327]`}
            />
          ))}
        </div>

        <div className="divide-y divide-[#232327]/70">
          {rows.map((row) => (
            <div key={row} className="flex items-start gap-4 px-5 py-4">
              <div className="w-32 shrink-0 space-y-2">
                <div className="h-3.5 w-28 rounded bg-[#232327]" />
                <div className="h-3 w-20 rounded bg-[#232327]" />
              </div>
              <div className="w-36 shrink-0 space-y-2">
                <div className="h-3.5 w-28 rounded bg-[#232327]" />
                <div className="h-3 w-24 rounded bg-[#232327]" />
              </div>
              <div className="w-16 shrink-0">
                <div className="h-6 w-16 rounded-lg bg-[#232327]" />
              </div>
              <div className="w-24 shrink-0 space-y-2">
                <div className="h-3.5 w-20 rounded bg-[#232327]" />
              </div>
              <div className="w-20 shrink-0 space-y-2">
                <div className="h-3.5 w-16 rounded bg-[#232327]" />
              </div>
              <div className="w-16 shrink-0">
                <div className="h-6 w-16 rounded-full bg-[#232327]" />
              </div>
              <div className="w-20 shrink-0 space-y-2">
                <div className="h-3.5 w-20 rounded bg-[#232327]" />
                <div className="h-3 w-14 rounded bg-[#232327]" />
              </div>
              <div className="ml-auto flex w-12 shrink-0 justify-end gap-1">
                <div className="size-8 rounded-lg bg-[#232327]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile / tablet card placeholders */}
      <div className="mt-6 grid gap-3 lg:hidden">
        {rows.slice(0, 4).map((card) => (
          <div
            key={card}
            className="rounded-2xl border border-[#232327] bg-[#151516] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-40 rounded bg-[#232327]" />
                <div className="h-3 w-24 rounded bg-[#232327]" />
              </div>
              <div className="h-6 w-16 shrink-0 rounded-full bg-[#232327]" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((cell) => (
                <div key={cell} className="space-y-2">
                  <div className="h-2.5 w-16 rounded bg-[#232327]" />
                  <div className="h-3.5 w-24 rounded bg-[#232327]" />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#232327] pt-3">
              <div className="h-6 w-20 rounded-lg bg-[#232327]" />
              <div className="size-8 rounded-lg bg-[#232327]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageJobsLoading
