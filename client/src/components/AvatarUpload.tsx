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
    if (file) setFileUrl(URL.createObjectURL(file));
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 px-4 pb-4 sm:pb-0">
      <div className="w-full sm:max-w-md bg-[#161614] border border-zinc-700 p-6 sm:p-8 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div>
            <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">
              profile
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100">
              Update Avatar
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Upload a new profile picture
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 border border-zinc-700 bg-zinc-800 flex items-center justify-center font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-zinc-800 mb-6 sm:mb-8" />

        {/* Preview */}
        <div className="flex justify-center mb-6 sm:mb-8">
          {fileUrl ? (
            <img
              src={fileUrl}
              alt="avatarPreview"
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover border-2 border-zinc-600"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 border border-dashed border-zinc-700 bg-zinc-900/60 flex flex-col items-center justify-center gap-2">
              <span className="font-mono text-2xl text-zinc-700">↑</span>
              <span className="font-mono text-xs text-zinc-600">no image</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="avatar"
              className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
            >
              Select Image
            </label>
            <label
              htmlFor="avatar"
              className={`flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-5 cursor-pointer transition-colors ${
                file
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900"
              }`}
            >
              {file ? (
                <div className="text-center">
                  <p className="font-mono text-sm text-amber-400">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-600 mt-1">
                    click to change
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-mono text-sm text-zinc-400">
                    click to select image
                  </p>
                  <p className="font-mono text-xs text-zinc-600 mt-1">
                    png, jpg, webp
                  </p>
                </div>
              )}
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          {/* Success */}
          {message && (
            <div className="flex items-start gap-3 border-l-2 border-emerald-500 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
              <span className="font-mono text-emerald-500 select-none">✓</span>
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              <span className="font-mono text-red-500 select-none">✕</span>
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-5 py-3 border border-zinc-700 font-mono text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all min-h-[44px]"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full sm:flex-1 py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isUploading ? "uploading···" : "upload avatar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AvatarUpload;
