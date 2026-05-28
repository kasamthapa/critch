import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import logo from "../../public/logo.png";
import { useState } from "react";
function Navbar() {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/?search=${searchValue}`);
  }
  return (
    <div className="flex  justify-between items-center p-4 text-zinc-700 ">
      <div className="flex items-center gap-10">
        <img src={logo} alt="logo" className="w-12 h-12  " />
        <Link to="/" className="hover:text-zinc-500">
          Home
        </Link>
        {user && (
          <Link to="/dashboard" className="hover:text-zinc-500">
            Dashboard
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 p-2">
        <form
          onSubmit={handleSubmit}
          className="flex border border-zinc-400 rounded p-1"
        >
          <input
            type="text"
            placeholder="Search..."
            className=" mr-1 p-1  outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button className="text-2xl font-bold" type="submit">
            <CiSearch />
          </button>
        </form>
        {!user ? (
          <div className="flex gap-5 ">
            <Link to="/signin" className="hover:text-zinc-500">
              Signin
            </Link>
            <Link to="/signup" className="hover:text-zinc-500">
              Signup
            </Link>
          </div>
        ) : (
          <button
            className="text-zinc-700 hover:text-zinc-500 "
            onClick={() => logout()}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
