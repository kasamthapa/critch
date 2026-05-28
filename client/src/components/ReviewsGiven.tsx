import type { ReviewDetails } from "../types/dashboard.types";

function ReviewsGiven({ reviews }: { reviews: ReviewDetails[] }) {
  return (
    <div>
      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="border border-zinc-800 border-dashed px-8 py-20 text-center">
          <p className="font-mono text-sm text-zinc-600 mb-2">0 reviews</p>
          <p className="text-base text-zinc-500">
            You haven't submitted any reviews yet.
          </p>
        </div>
      )}

      {/* Review list */}
      <div className="flex flex-col divide-y divide-zinc-800/70">
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className="group relative py-8 -mx-4 px-4 transition-colors hover:bg-zinc-900/40"
          >
            {/* Amber left bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200" />

            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-baseline gap-4 min-w-0">
                <span className="font-mono text-sm text-zinc-700 shrink-0 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-zinc-100 truncate">
                    {r.project.title}
                  </h2>
                  <p className="font-mono text-sm text-zinc-600 mt-1">
                    {new Date(r.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <span className="shrink-0 font-mono text-xs text-zinc-600 border border-zinc-800 px-3 py-1.5 bg-zinc-900/60 uppercase tracking-wider">
                review
              </span>
            </div>

            {/* Score grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-8">
              {[
                { label: "Idea", value: r.ideaScore },
                { label: "Code", value: r.codeQuality },
                { label: "UI Design", value: r.uiDesign },
                { label: "Docs", value: r.documentation },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-zinc-800 bg-zinc-900/60 px-4 py-3"
                >
                  <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-zinc-100">
                      {value}
                    </span>
                    <span className="font-mono text-sm text-zinc-600">/5</span>
                  </div>
                  {/* Score bar */}
                  <div className="mt-2.5 h-0.5 bg-zinc-800">
                    <div
                      className="h-0.5 bg-amber-500 transition-all"
                      style={{ width: `${(Number(value) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comment */}
            {r.comment && (
              <div className="mt-6 ml-8 border-l border-zinc-700 pl-5">
                <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                  feedback
                </p>
                <p className="text-base text-zinc-400 leading-relaxed">
                  {r.comment}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsGiven;
