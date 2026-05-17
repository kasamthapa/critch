import { useState } from "react";

import { avatarUpload } from "../api/user.api";

function AvatarUpload({
  setIsOpen,
  setRefreshKey,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (file) setFileUrl(URL.createObjectURL(file));
  }
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();

    if (file) fd.append("avatar", file);
    try {
      const response = await avatarUpload(fd);
      setMessage(response.message);
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
        setIsOpen(false);
      }, 2000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-md bg-white border-2 border-black rounded-xl p-6">
        <button
          onClick={() => setIsOpen(false)}
          className=" float-end text-xl font-bold cursor-pointer"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center">User Avatar</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="avatar" className="italic">
            Upload avatar
          </label>
          <br />
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            className="mt-2"
          />
          <br />
          <br />
          {fileUrl !== "" && (
            <img
              src={fileUrl}
              alt="avatarPreview"
              className="w-[200px] h-[200px] rounded"
            />
          )}{" "}
          <br />
          <button
            type="submit"
            className="border-2 border-black px-4 py-1 rounded"
          >
            Upload
          </button>
        </form>
        <p className="text-green-700 mt-3">{message}</p>
        <p className="text-red-500 mt-3">{error}</p>
      </div>
    </div>
  );
}

export default AvatarUpload;
