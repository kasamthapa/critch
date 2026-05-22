import type { ProjectDataSummary } from "../types/dashboard.types";

function ReviewsReceived({ projects }: { projects: ProjectDataSummary[] }) {
  return (
    <div>
      <h1 className="text-center text-3xl border-b-2 border-black">
        Reviews | Received
      </h1>
    </div>
  );
}

export default ReviewsReceived;
