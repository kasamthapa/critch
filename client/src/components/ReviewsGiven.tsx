import type { ReviewDetails } from "../types/dashboard.types";

function ReviewsGiven({ reviews }: { reviews: ReviewDetails[] }) {
  return (
    <div className="bg-zinc-100 min-h-screen p-6 rounded-2xl">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-800">Reviews Given</h1>

        <p className="text-zinc-500 mt-1">
          Reviews and feedback you have submitted
        </p>
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center text-zinc-500 shadow-sm">
          No reviews given yet.
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-5">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-800">
                  {r.project.title}
                </h2>

                <p className="text-sm text-zinc-500 mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium">
                Review
              </div>
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                <p className="text-sm text-zinc-500">Idea</p>
                <p className="text-2xl font-bold text-zinc-800">
                  {r.ideaScore}/5
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                <p className="text-sm text-zinc-500">Code Quality</p>
                <p className="text-2xl font-bold text-zinc-800">
                  {r.codeQuality}/5
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                <p className="text-sm text-zinc-500">UI Design</p>
                <p className="text-2xl font-bold text-zinc-800">
                  {r.uiDesign}/5
                </p>
              </div>

              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
                <p className="text-sm text-zinc-500">Documentation</p>
                <p className="text-2xl font-bold text-zinc-800">
                  {r.documentation}/5
                </p>
              </div>
            </div>

            {/* Feedback */}
            {r.comment && (
              <div className="mt-6 border-t border-zinc-200 pt-4">
                <p className="text-sm font-medium text-zinc-500 mb-2">
                  Feedback
                </p>

                <p className="text-zinc-700 leading-relaxed">{r.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsGiven;
