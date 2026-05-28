import { useState } from "react";
import type { ProjectWithReviews } from "../types/dashboard.types";

function ReviewsReceived({ projects }: { projects: ProjectWithReviews[] }) {
  const [expandedProject, setExpandedProject] = useState<
    Record<number, boolean>
  >({});

  const ScoreCard = ({
    label,
    value,
  }: {
    label: string;
    value: number | string;
  }) => (
    <div className="border border-zinc-800 bg-zinc-900/60 px-4 py-3">
      <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-zinc-100">{value}</span>
        <span className="font-mono text-sm text-zinc-600">/5</span>
      </div>
      <div className="mt-2.5 h-0.5 bg-zinc-800">
        <div
          className="h-0.5 bg-amber-500 transition-all"
          style={{ width: `${(Number(value) / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  const ReviewCard = ({ r }: { r: ProjectWithReviews["reviews"][number] }) => (
    <div className="border border-zinc-800 bg-zinc-900/30 p-5">
      {/* Reviewer row */}
      <div className="flex items-center gap-3 mb-5">
        <img
          src={r.user.avatarURL}
          alt="userProfile"
          className="w-9 h-9 object-cover border border-zinc-700"
        />
        <div>
          <p className="text-sm font-medium text-zinc-200">{r.user.username}</p>
          <p className="font-mono text-xs text-zinc-600 mt-0.5">
            {new Date(r.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ScoreCard label="Idea" value={r.ideaScore} />
        <ScoreCard label="Code" value={r.codeQuality} />
        <ScoreCard label="UI Design" value={r.uiDesign} />
        <ScoreCard label="Docs" value={r.documentation} />
      </div>

      {/* Comment */}
      {r.comment && (
        <div className="mt-5 border-l border-zinc-700 pl-5">
          <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-2">
            feedback
          </p>
          <p className="text-base text-zinc-400 leading-relaxed">{r.comment}</p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Empty state */}
      {projects.length === 0 && (
        <div className="border border-zinc-800 border-dashed px-8 py-20 text-center">
          <p className="font-mono text-sm text-zinc-600 mb-2">0 reviews</p>
          <p className="text-base text-zinc-500">No reviews received yet.</p>
        </div>
      )}

      {/* Project blocks */}
      <div className="flex flex-col gap-6">
        {projects.map((p) => (
          <div key={p.id} className="border border-zinc-800 bg-zinc-900/20">
            {/* Project header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">
                  {p.title}
                </h2>

                <div className="flex items-center gap-5 mt-2">
                  <span className="font-mono text-sm text-zinc-500">
                    <span className="text-amber-500">★</span>{" "}
                    <span className="text-zinc-300">{p.avgRating}</span> avg
                  </span>
                  <span className="font-mono text-sm text-zinc-600">
                    {p._count.reviews} review{p._count.reviews !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  setExpandedProject((prev) => ({
                    ...prev,
                    [p.id]: !prev[p.id],
                  }))
                }
                className="shrink-0 inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                {expandedProject[p.id] ? "collapse" : "view all"}
                <span
                  className={`text-xs text-zinc-600 transition-transform duration-150 ${
                    expandedProject[p.id] ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
            </div>

            {/* Reviews */}
            <div className="p-5 flex flex-col gap-4">
              {!expandedProject[p.id]
                ? p.reviews[0] && <ReviewCard r={p.reviews[0]} />
                : p.reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsReceived;
