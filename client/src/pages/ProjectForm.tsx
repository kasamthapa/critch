import { useState } from "react";
import { createProject } from "../api/project.api";
import { useNavigate } from "react-router-dom";

function ProjectForm() {
  const initialValue = {
    title: "",
    description: "",
    liveURL: "",
    githubURL: "",
    tags: "",
  };
  const [formValues, setFormValues] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  }
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", formValues.title);
    fd.append("description", formValues.description);
    fd.append("liveURL", formValues.liveURL);
    fd.append("githubURL", formValues.githubURL);
    fd.append("tags", formValues.tags);
    if (file) fd.append("screenshot", file);
    try {
      const response = await createProject(fd);
      navigate("/", {
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
        <label htmlFor="screenshot">Project screenshot</label>
        <br />
        <input
          type="file"
          name="screenshot"
          id="screenshot"
          onChange={handleFileChange}
        />
        <br />
        <br />
        <button type="submit">Create</button>
      </form>
      {error}
    </div>
  );
}

export default ProjectForm;

// export interface CreateProjectRequest {
//   title: string;
//   description: string;
//   liveURL: string;
//   githubURL: string;
//   tags: string; // comma separated — "node,react,typescript"
//   screenshot: File; // file upload — added separately since backend schema doesn't cover it
// }
