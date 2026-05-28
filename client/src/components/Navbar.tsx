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
    <nav className="w-full border-b border-zinc-200 bg-white shadow-sm px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-zinc-800">YourApp</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="text-zinc-700 hover:text-black transition">
              Home
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="text-zinc-700 hover:text-black transition"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-zinc-300 rounded-lg px-3 py-2 bg-zinc-50 focus-within:border-zinc-500 transition"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-48"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button
              type="submit"
              className="text-xl text-zinc-600 hover:text-black transition"
            >
              <CiSearch />
            </button>
          </form>

          {/* AUTH */}
          {!user ? (
            <div className="flex items-center gap-3 text-sm font-medium">
              <Link
                to="/signin"
                className="text-zinc-700 hover:text-black transition"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* PROFILE BLOCK */}
              <div className="flex items-center gap-3 bg-zinc-100 hover:bg-zinc-200 transition px-3 py-2 rounded-xl border border-zinc-200 cursor-pointer">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="userProfile"
                    className="w-10 h-10 rounded-full object-cover border border-zinc-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white border border-zinc-300 flex items-center justify-center">
                    <FaUser className="text-zinc-500 text-sm" />
                  </div>
                )}

                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-zinc-500">Welcome</span>
                  <p className="text-sm font-semibold text-zinc-800">
                    @{user?.username}
                  </p>
                </div>
              </div>

              {/* LOGOUT */}
              <button
                onClick={() => logout()}
                className="text-sm font-medium text-zinc-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
