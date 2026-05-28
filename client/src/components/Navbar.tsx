import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import logo from "../../public/logo.png";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/?search=${searchValue}`);
  }

  return (
    <nav className="w-full border-b border-zinc-800 bg-[#111110]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* LEFT */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img
                src={logo}
                alt="logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain opacity-90"
              />
              <span className="font-mono text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
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
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile search toggle */}
            <button
              className="sm:hidden w-10 h-10 flex items-center justify-center text-lg text-zinc-500 hover:text-zinc-200 transition-colors"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
            >
              <CiSearch />
            </button>

            {/* Desktop search */}
            <form
              onSubmit={handleSubmit}
              className="hidden sm:flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-3.5 py-2 focus-within:border-zinc-500 transition-colors"
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
              <div className="flex items-center gap-1 sm:gap-2 font-mono text-sm">
                <Link
                  to="/signin"
                  className="text-zinc-500 hover:text-zinc-200 transition-colors px-2 sm:px-3 py-2 min-h-[44px] flex items-center"
                >
                  sign in
                </Link>
                <Link
                  to="/signup"
                  className="border border-zinc-600 bg-zinc-800 text-zinc-200 px-3 sm:px-4 py-2 hover:border-zinc-400 hover:text-white hover:bg-zinc-700 transition-all min-h-[44px] flex items-center"
                >
                  sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 sm:gap-2.5 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 hover:bg-zinc-800 transition-all px-2.5 py-2 min-h-[44px]"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="userProfile"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <FaUser className="text-zinc-500 text-xs" />
                    </div>
                  )}
                  <span className="font-mono text-xs sm:text-sm text-zinc-400 hidden sm:block">
                    @{user?.username}
                  </span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="font-mono text-xs sm:text-sm text-zinc-600 hover:text-red-400 transition-colors px-1 min-h-[44px] flex items-center"
                >
                  logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar — slides open */}
        {isMobileSearchOpen && (
          <div className="sm:hidden pb-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 focus-within:border-zinc-500 transition-colors"
            >
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-transparent outline-none font-mono text-sm text-zinc-300 placeholder:text-zinc-600 flex-1"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="text-lg text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <CiSearch />
              </button>
            </form>
          </div>
        )}

        {/* Mobile nav links */}
        <div className="sm:hidden flex items-center gap-6 pb-3 border-t border-zinc-800/50 pt-3">
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
    </nav>
  );
}

export default Navbar;
