import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import logo from "../../public/logo.png";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/?search=${searchValue}`);
  }

  return (
    <nav className="w-full border-b border-zinc-800 bg-[#111110] px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logo}
              alt="logo"
              className="w-7 h-7 object-contain opacity-90"
            />
            <span className="font-mono text-base font-semibold text-zinc-100 tracking-tight">
              critch
            </span>
          </Link>

          <div className="h-5 w-px bg-zinc-700 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/"
              className="font-mono text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              explore
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="font-mono text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                dashboard
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-3.5 py-2 focus-within:border-zinc-500 transition-colors"
          >
            <input
              type="text"
              placeholder="Search projects..."
              className="bg-transparent outline-none font-mono text-sm text-zinc-300 placeholder:text-zinc-600 w-40 sm:w-52"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              className="text-lg text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <CiSearch />
            </button>
          </form>

          {/* Logged out */}
          {!user ? (
            <div className="flex items-center gap-2 font-mono text-sm">
              <Link
                to="/signin"
                className="text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-2"
              >
                sign in
              </Link>

              <Link
                to="/signup"
                className="border border-zinc-600 bg-zinc-800 text-zinc-200 px-4 py-2 hover:border-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
              >
                sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile block */}
              <Link
                to="/profile"
                className="flex items-center gap-3 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all px-3 py-2 cursor-pointer"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="userProfile"
                    className="w-7 h-7 object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <FaUser className="text-zinc-500 text-xs" />
                  </div>
                )}
                <span className="font-mono text-sm text-zinc-400">
                  @{user?.username}
                </span>
              </Link>

              <button
                onClick={() => logout()}
                className="font-mono text-sm text-zinc-600 hover:text-red-400 transition-colors"
              >
                logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
