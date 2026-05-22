import { useEffect, useState } from "react";
import { editProject } from "../api/project.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { editProjectRequest } from "../types/project.types";

function ProjectEditPage() {
  const [error, setError] = useState("");

  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const [formValues, setFormValues] = useState({
    title: state?.title || "",
    description: state?.description || "",
    liveURL: state?.liveURL || "",
    githubURL: state?.githubURL || "",
    tags: state?.tags || "",
  });
  useEffect(() => {
    if (!location.state) navigate(`/projects/${projectId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (projectId == undefined) {
      setError("Project id undefined");
      return;
    }
    const payload: editProjectRequest = { ...formValues };
    try {
      const response = await editProject(payload, projectId);
      navigate(location.state?.from, {
        state: { message: response.message },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    }
  }

  return (
    <div>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter project title"
          value={formValues.title}
          onChange={handleChange}
        />
        <br />

        <br />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          placeholder="Enter project description"
          value={formValues.description}
          onChange={handleChange}
        />
        <br />
        <br />
        <label htmlFor="liveUrl">LiveUrl</label>
        <input
          type="text"
          name="liveURL"
          id="liveUrl"
          placeholder="Enter your project's live URL"
          value={formValues.liveURL}
          onChange={handleChange}
        />
        <br />
        <br />
        <label htmlFor="githubUrl">GithubUrl</label>
        <input
          type="text"
          name="githubURL"
          id="githubUrl"
          placeholder="Enter github Url of the project"
          value={formValues.githubURL}
          onChange={handleChange}
        />
        <br />
        <br />
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          name="tags"
          id="tags"
          placeholder="pyhton,react,typescript.."
          value={formValues.tags}
          onChange={handleChange}
        />

        <br />
        <br />
        <button type="submit">Update</button>
      </form>
      {error}
    </div>
  );
}

export default ProjectEditPage;
