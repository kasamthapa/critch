import { useState } from "react";
import type { CreateReviewRequest } from "../types/review.types";
import { useParams } from "react-router-dom";
import { createReview } from "../api/project.api";

function ReviewForm({
  setIsCreateReview,
  setRefreshKey,
  setFlashMessage,
}: {
  setIsCreateReview: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  setFlashMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const initialValue = {
    codeQuality: 0,
    uiDesign: 0,
    ideaScore: 0,
    documentation: 0,
    comment: "",
  };

  const [formValues, setFormValues] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const projectId = Number(id);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === "comment" ? value : Number(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) {
      setError("Project Id undefined");
      return;
    }
    setIsSubmitting(true);
    const payload: CreateReviewRequest = { ...formValues, projectId };
    try {
      const response = await createReview(payload);
      setIsCreateReview(false);
      setRefreshKey((prev) => prev + 1);
      setFlashMessage(response.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const scores = [
    { id: "codeQuality", label: "Code Quality", value: formValues.codeQuality },
    { id: "uiDesign", label: "UI Design", value: formValues.uiDesign },
    { id: "ideaScore", label: "Idea", value: formValues.ideaScore },
    { id: "documentation", label: "Docs", value: formValues.documentation },
  ] as const;

  return (
    <div>
      {/* Submitting */}
      {isSubmitting && (
        <div className="flex items-center gap-3 py-12 text-sm sm:text-base text-zinc-600">
          <span className="font-mono animate-pulse text-lg">···</span>
          <span>submitting review</span>
        </div>
      )}

      {!isSubmitting && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
          {/* Score grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {scores.map(({ id, label, value }) => (
              <div
                key={id}
                className="border border-zinc-800 bg-zinc-900/60 px-4 sm:px-5 py-4 sm:py-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <label
                    htmlFor={id}
                    className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
                  >
                    {label}
                  </label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-zinc-100">
                      {value}
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-zinc-600">
                      /5
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="relative mb-3 h-0.5 bg-zinc-800">
                  <div
                    className="absolute left-0 top-0 h-0.5 bg-amber-500 transition-all"
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>

                <input
                  type="range"
                  min={0}
                  max={5}
                  id={id}
                  name={id}
                  value={value}
                  onChange={handleChange}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="comment"
              className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
            >
              Feedback
            </label>
            <textarea
              id="comment"
              name="comment"
              onChange={handleChange}
              value={formValues.comment}
              rows={5}
              placeholder="Write your thoughts about this project..."
              className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none resize-none focus:border-zinc-400 transition-colors leading-relaxed"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              <span className="font-mono text-red-500 select-none mt-0.5">
                ✕
              </span>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateReview(false)}
              className="w-full sm:w-auto px-5 py-3 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
            >
              cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px]"
            >
              submit review
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReviewForm;
