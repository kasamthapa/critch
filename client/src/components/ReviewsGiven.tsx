import type { ReviewDetails } from "../types/dashboard.types";

function ReviewsGiven({ reviews }: { reviews: ReviewDetails[] }) {
  return (
    <div>
      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="border border-zinc-800 border-dashed px-6 sm:px-8 py-16 sm:py-20 text-center">
          <p className="font-mono text-xs sm:text-sm text-zinc-600 mb-2">
            0 reviews
          </p>
          <p className="text-sm sm:text-base text-zinc-500">
            You haven't submitted any reviews yet.
          </p>
        </div>
      )}

      <div className="flex flex-col divide-y divide-zinc-800/70">
        {reviews.map((r, i) => (
          <div
            key={r.id}
            className="group relative py-6 sm:py-8 -mx-3 sm:-mx-4 px-3 sm:px-4 transition-colors hover:bg-zinc-900/40"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-200" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
              <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                <span className="font-mono text-xs sm:text-sm text-zinc-700 shrink-0 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-100 truncate">
                    {r.project.title}
                  </h2>
                  <p className="font-mono text-xs sm:text-sm text-zinc-600 mt-1">
                    {new Date(r.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <span className="shrink-0 font-mono text-xs text-zinc-600 border border-zinc-800 px-2.5 sm:px-3 py-1.5 bg-zinc-900/60 uppercase tracking-wider">
                review
              </span>
            </div>

            {/* Score grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 ml-7 sm:ml-8">
              {[
                { label: "Idea", value: r.ideaScore },
                { label: "Code", value: r.codeQuality },
                { label: "UI Design", value: r.uiDesign },
                { label: "Docs", value: r.documentation },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-zinc-800 bg-zinc-900/60 px-3 sm:px-4 py-3"
                >
                  <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-zinc-100">
                      {value}
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-zinc-600">
                      /5
                    </span>
                  </div>
                  <div className="mt-2.5 h-0.5 bg-zinc-800">
                    <div
                      className="h-0.5 bg-amber-500"
                      style={{ width: `${(Number(value) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Comment */}
            {r.comment && (
              <div className="mt-5 sm:mt-6 ml-7 sm:ml-8 border-l border-zinc-700 pl-4 sm:pl-5">
                <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
                  feedback
                </p>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
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
