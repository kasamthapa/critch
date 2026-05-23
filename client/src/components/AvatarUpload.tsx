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

  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    setFile(file);

    if (file) {
      setFileUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first");

      return;
    }

    setIsUploading(true);

    const fd = new FormData();

    fd.append("avatar", file);

    try {
      const response = await avatarUpload(fd);

      setMessage(response.message);

      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);

        setIsOpen(false);
      }, 1500);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal */}
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Update Avatar</h1>

            <p className="text-sm text-zinc-500 mt-1">
              Upload a new profile picture
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 transition flex items-center justify-center text-zinc-700"
          >
            ✕
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center mb-6">
          {fileUrl ? (
            <img
              src={fileUrl}
              alt="avatarPreview"
              className="w-40 h-40 rounded-full object-cover border-4 border-zinc-100"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center text-zinc-400 text-sm">
              No image selected
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="avatar"
              className="block mb-2 font-medium text-zinc-700"
            >
              Select Image
            </label>

            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 text-sm file:mr-4 file:border-0 file:bg-black file:text-white file:px-4 file:py-2 file:rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3 rounded-2xl bg-black text-white font-medium hover:bg-zinc-800 transition disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload Avatar"}
          </button>
        </form>

        {/* Success */}
        {message && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default AvatarUpload;
