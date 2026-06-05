export default function GoalsLoading() {
  return (
    <div className="flex flex-col h-full p-6 gap-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 rounded-lg bg-white/10" />
        <div className="h-9 w-28 rounded-lg bg-white/10" />
      </div>

      {/* Vision board / goal cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3"
          >
            {/* Category tag */}
            <div className="h-5 w-20 rounded-full bg-white/10" />
            {/* Title */}
            <div className="h-6 w-3/4 rounded-lg bg-white/10" />
            {/* Description */}
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-5/6 rounded bg-white/10" />
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full rounded-full bg-white/10 mt-2">
              <div className="h-2 rounded-full bg-white/20" style={{ width: `${20 + i * 12}%` }} />
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between mt-1">
              <div className="h-4 w-16 rounded bg-white/10" />
              <div className="h-4 w-12 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
