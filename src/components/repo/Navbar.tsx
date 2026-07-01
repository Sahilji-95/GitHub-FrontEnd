import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../authContext";

export interface GitHubNavbarProps {
  onCreateRepository?: () => void;
}

const Navbar: React.FC<GitHubNavbarProps> = ({ onCreateRepository }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { setCurrUser } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/profile");
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub"
            className="h-10 w-10 rounded-full bg-white"
          />
          <span className="hidden text-lg font-semibold text-white sm:block">
            GitHub
          </span>
        </a>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCreateRepository}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            + Create repository
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-expanded={isMenuOpen}
              className="flex items-center gap-2 rounded-md p-1.5 text-white hover:bg-gray-800"
            >
              <img
                src="https://avatars.githubusercontent.com/u/9919?v=4"
                alt="User"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden text-sm sm:block">User</span>
              <span className={isMenuOpen ? "rotate-180" : ""}>⌄</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-gray-700 bg-gray-900 py-1 shadow-xl">
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                  onClick={handleNavigate}
                >
                  Profile
                </button>
                <Link to="/staredRepo">
                  <button className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800">
                    Stared Repositories
                  </button>
                </Link>
                <button className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800">
                  Settings
                </button>
                <div className="my-1 border-t border-gray-700" />
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");

                    setCurrUser(null);
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
