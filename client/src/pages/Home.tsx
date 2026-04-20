import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProjects } from "../api/project.api";
import type { ProjectSummary } from "../types/project.types";

export function Home() {
  const [projects, setProjects] = useState<Array<ProjectSummary>>([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [flashMessage, setFlashMessage] = useState(
    location.state?.message || "",
  );
  useEffect(() => {
    if (flashMessage) {
      const timer = setTimeout(() => {
        setFlashMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flashMessage]);
  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        const response = await getProjects();
        setProjects(response.data.projects);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, []);

  return (
    <>
      {isLoading ? (
        "....Loading"
      ) : (
        <div>
          <span>{flashMessage}</span>
          <h1>HomePage</h1>
          <div className="projectsContainer">
            {projects !== undefined &&
              projects.map((p) => (
                <div key={p.id}>
                  <h3>{p.title}</h3>
                  <span>{p.created_at}</span>
                  <p>Author:{p.author.username}</p>
                  <p>{p.description}</p>
                  <a href={p.liveURL} target="_blank">
                    Try live
                  </a>
                  <br />
                  <a href={p.githubURL} target="_blank">
                    View Code
                  </a>
                  <p>
                    {p.tags.map((t) => (
                      <span key={t}>#{t}</span>
                    ))}
                  </p>
                  <img
                    src={p.screenshotURL}
                    alt="projectScreenshot"
                    width={100}
                    height={100}
                  />
                  <p>Reviews:{p._count.reviews}</p>
                  <p>AverageRating:{p.avgRating}</p>
                </div>
              ))}
          </div>
          <span>{error}</span>
        </div>
      )}
    </>
  );
}

export default Home;
