import type { SimpleReview } from "../types/review.types";

function ReviewsGiven({ reviews }: { reviews: SimpleReview[] }) {
  return (
    <div>
      <h1 className="text-center text-3xl border-b-2 border-black">
        Reviews | Given
      </h1>
    </div>
  );
}

export default ReviewsGiven;
