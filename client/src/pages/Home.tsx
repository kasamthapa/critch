import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjects } from "../api/project.api";
import type { ProjectSummary } from "../types/project.types";
import { useAuth } from "../hooks/useAuth";

export function Home() {
  const [projects, setProjects] = useState<Array<ProjectSummary>>([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [tags, setTags] = useState<Array<string>>([]);
  const [flashMessage, setFlashMessage] = useState(
    location.state?.message || "",
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState("");
  function handleTagSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTag(e.target.value);
  }
  function handleProjectClick(id: number) {
    navigate(`/projects/${id}`);
  }
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
        const response = await getProjects(selectedTag);

        setProjects(response.data.projects);
        if (!selectedTag) {
          const allTags = response.data.projects.flatMap((p) => p.tags);
          const uniqueTags = [...new Set(allTags)];
          setTags(uniqueTags);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, [selectedTag]);

  return (
    <>
      {isLoading ? (
        "....Loading"
      ) : (
        <div>
          <span>{flashMessage}</span>
          <h1>HomePage</h1>
          <span style={{ marginRight: 8 }}>Filter:</span>
          <select name="tag" onChange={handleTagSelect} value={selectedTag}>
            <option value="">All projects</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <br />
          {user && (
            <button onClick={() => navigate("/projects/new")}>
              Create Project
            </button>
          )}
          <div
            className="projectsContainer"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
            }}
          >
            {projects !== undefined &&
              projects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "2px solid white",
                    borderRadius: "5px",
                    width: "30rem",
                    marginBottom: "15px",
                  }}
                  onClick={() => handleProjectClick(p.id)}
                >
                  <h3>{p.title} </h3>
                  <span style={{ fontSize: 12 }}>Posted on:{p.created_at}</span>
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
