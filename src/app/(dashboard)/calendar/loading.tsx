export default function CalendarLoading() {
  return (
    <div className="flex flex-col h-full p-6 gap-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-40 rounded-lg bg-white/10" />
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-lg bg-white/10" />
          <div className="h-8 w-20 rounded-lg bg-white/10" />
          <div className="h-8 w-20 rounded-lg bg-white/10" />
        </div>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-6 rounded bg-white/10" />
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/5 border border-white/10 p-2 flex flex-col gap-1 min-h-[80px]"
          >
            <div className="h-4 w-6 rounded bg-white/10" />
            {i % 4 === 0 && <div className="h-3 rounded bg-white/10 mt-1" />}
            {i % 7 === 2 && <div className="h-3 rounded bg-white/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}
