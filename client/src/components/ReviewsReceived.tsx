import { useState } from "react";
import type { ProjectWithReviews } from "../types/dashboard.types";

function ReviewsReceived({ projects }: { projects: ProjectWithReviews[] }) {
  const [expandedProject, setExpandedProject] = useState<
    Record<number, boolean>
  >({});
  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-800">Reviews Received</h1>
          <p className="text-zinc-500 mt-1">
            Feedback and ratings on your projects
          </p>
        </div>

        {/* Projects */}
        <div className="space-y-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-800">
                    {p.title}
                  </h2>

                  <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                    <p>
                      Avg Rating:
                      <span className="font-medium text-zinc-700 ml-1">
                        {p.avgRating}
                      </span>
                    </p>

                    <p>
                      Reviews:
                      <span className="font-medium text-zinc-700 ml-1">
                        {p._count.reviews}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-zinc-800 transition"
                  onClick={() =>
                    setExpandedProject((prev) => ({
                      ...prev,
                      [p.id]: !prev[p.id],
                    }))
                  }
                >
                  View all
                </button>{" "}
              </div>

              {/* Reviews */}
              {!expandedProject[p.id] ? (
                <div className="p-6 space-y-4">
                  <div
                    key={p.reviews[0].id}
                    className="border border-zinc-200 rounded-xl p-4 bg-zinc-50"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={p.reviews[0].user.avatarURL}
                        alt="userProfile"
                        className="w-12 h-12 rounded-full object-cover border"
                      />

                      <div>
                        <p className="font-semibold text-zinc-800">
                          {p.reviews[0].user.username}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {new Date(
                            p.reviews[0].created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3 border">
                        <p className="text-sm text-zinc-500">Idea</p>
                        <p className="font-bold text-lg">
                          {p.reviews[0].ideaScore}/5
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border">
                        <p className="text-sm text-zinc-500">Code Quality</p>
                        <p className="font-bold text-lg">
                          {p.reviews[0].codeQuality}/5
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border">
                        <p className="text-sm text-zinc-500">UI Design</p>
                        <p className="font-bold text-lg">
                          {p.reviews[0].uiDesign}/5
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-3 border">
                        <p className="text-sm text-zinc-500">Documentation</p>
                        <p className="font-bold text-lg">
                          {p.reviews[0].documentation}/5
                        </p>
                      </div>
                      <p className="mt-4 text-zinc-700 leading-relaxed">
                        Feedback:{p.reviews[0].comment}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {p.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border border-zinc-200 rounded-xl p-4 bg-zinc-50"
                    >
                      {/* User */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={r.user.avatarURL}
                          alt="userProfile"
                          className="w-12 h-12 rounded-full object-cover border"
                        />

                        <div>
                          <p className="font-semibold text-zinc-800">
                            {r.user.username}
                          </p>

                          <p className="text-sm text-zinc-500">
                            {new Date(r.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-sm text-zinc-500">Idea</p>
                          <p className="font-bold text-lg">{r.ideaScore}/5</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-sm text-zinc-500">Code Quality</p>
                          <p className="font-bold text-lg">{r.codeQuality}/5</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-sm text-zinc-500">UI Design</p>
                          <p className="font-bold text-lg">{r.uiDesign}/5</p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border">
                          <p className="text-sm text-zinc-500">Documentation</p>
                          <p className="font-bold text-lg">
                            {r.documentation}/5
                          </p>
                        </div>
                        <p className="mt-4 text-zinc-700 leading-relaxed">
                          Feedback:{r.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewsReceived;
