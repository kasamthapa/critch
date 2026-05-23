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

    const payload: CreateReviewRequest = {
      ...formValues,
      projectId,
    };

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

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-zinc-800">Create Review</h2>

        <p className="text-zinc-500 mt-2">
          Share your feedback about this project
        </p>
      </div>

      {isSubmitting ? (
        <div className="text-center py-10 text-zinc-500">
          Submitting review...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Code Quality */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="codeQuality"
                  className="font-medium text-zinc-700"
                >
                  Code Quality
                </label>

                <span className="text-2xl font-bold text-zinc-800">
                  {formValues.codeQuality}/5
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                id="codeQuality"
                name="codeQuality"
                value={formValues.codeQuality}
                onChange={handleChange}
                className="w-full accent-black"
              />
            </div>

            {/* UI Design */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="uiDesign" className="font-medium text-zinc-700">
                  UI Design
                </label>

                <span className="text-2xl font-bold text-zinc-800">
                  {formValues.uiDesign}/5
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                id="uiDesign"
                name="uiDesign"
                value={formValues.uiDesign}
                onChange={handleChange}
                className="w-full accent-black"
              />
            </div>

            {/* Idea Score */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="ideaScore"
                  className="font-medium text-zinc-700"
                >
                  Idea Score
                </label>

                <span className="text-2xl font-bold text-zinc-800">
                  {formValues.ideaScore}/5
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                name="ideaScore"
                id="ideaScore"
                value={formValues.ideaScore}
                onChange={handleChange}
                className="w-full accent-black"
              />
            </div>

            {/* Documentation */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <label
                  htmlFor="documentation"
                  className="font-medium text-zinc-700"
                >
                  Documentation
                </label>

                <span className="text-2xl font-bold text-zinc-800">
                  {formValues.documentation}/5
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                id="documentation"
                name="documentation"
                value={formValues.documentation}
                onChange={handleChange}
                className="w-full accent-black"
              />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="comment"
              className="block mb-3 font-medium text-zinc-700"
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
              className="w-full border border-zinc-200 rounded-2xl px-4 py-4 bg-zinc-50 outline-none resize-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsCreateReview(false)}
              className="px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-black text-white hover:bg-zinc-800 transition"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

export default ReviewForm;
