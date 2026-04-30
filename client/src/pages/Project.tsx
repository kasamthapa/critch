import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ProjectDetail } from "../types/project.types";
import { getOneProject } from "../api/project.api";

function Project() {
  const [project, setProject] = useState<ProjectDetail>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const makeRequest = async () => {
      if (!id) {
        setError("Project Id undefined ");
        return;
      }
      setIsLoading(true);
      try {
        const response = await getOneProject(id);
        setProject(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, [id]);
  return (
    <>
      {isLoading ? (
        "Loading....."
      ) : (
        <div>
          <p>{project?.title}</p>
          {error}
        </div>
      )}
    </>
  );
}

export default Project;
