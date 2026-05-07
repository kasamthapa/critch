import { useState } from "react";
import type { CreateReviewRequest } from "../types/review.types";
import { useNavigate, useParams } from "react-router-dom";
import { createReview } from "../api/project.api";

function ReviewForm({
  setIsCreateReview,
}: {
  setIsCreateReview: React.Dispatch<React.SetStateAction<boolean>>;
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
  const navigate = useNavigate();
  const { id } = useParams();
  const projectId = Number(id);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name == "comment" ? value : Number(value),
    }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId) {
      setError("Project Id undefined ");
      return;
    }
    setIsSubmitting(true);
    const payload: CreateReviewRequest = { ...formValues, projectId };
    try {
      const response = await createReview(payload);
      setIsCreateReview(false);
      navigate(`/projects/${projectId}`, {
        state: { message: response.message },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div>
      <h2>Review Form</h2>
      {isSubmitting ? (
        "Submitiing..."
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="codeQuality">CodeQuality</label>
          <input
            type="range"
            min={0}
            max={5}
            id="codeQuality"
            name="codeQuality"
            value={formValues.codeQuality}
            onChange={handleChange}
          />
          :{formValues.codeQuality}
          <br />
          <label htmlFor="uiDesign">uiDesign</label>
          <input
            type="range"
            min={0}
            max={5}
            id="uiDesign"
            name="uiDesign"
            value={formValues.uiDesign}
            onChange={handleChange}
          />
          {formValues.uiDesign}
          <br />
          <label htmlFor="ideaScore">ideaScore</label>
          <input
            type="range"
            min={0}
            max={5}
            name="ideaScore"
            id="ideaScore"
            value={formValues.ideaScore}
            onChange={handleChange}
          />
          {formValues.ideaScore}
          <br />
          <label htmlFor="codeQuality">documentation</label>
          <input
            type="range"
            min={0}
            max={5}
            id="documentation"
            name="documentation"
            value={formValues.documentation}
            onChange={handleChange}
          />
          {formValues.documentation}
          <br />
          <label htmlFor="comment">Comment:</label>
          <textarea id="comment" name="comment" onChange={handleChange} />
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
      {error}
    </div>
  );
}

export default ReviewForm;
