import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Hero from "../repo/Hero";

import { useNavigate } from "react-router-dom";

interface RepoRes {
  _id: string;
  name: string;
  description: string;
  visibility: boolean;
  owner: { username: string; _id: string };
  createdAt: string;
  updatedAt: string;
  isStarred?: boolean;
}
export default function Dashboard() {
  const [repos, setRepos] = useState<RepoRes[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggesRepo, setSuggesRepo] = useState<RepoRes[]>([]);
  const [searchResult, setSearchResult] = useState<RepoRes[]>([]);
  const [starringRepo, setStarringRepo] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // console.log("TOKEN:", token);
    // console.log("USER ID:", userId);
    const fetchRepos = async () => {
      try {
        const res = await axios.get<RepoRes[]>(
          `http://65.2.122.179:8080/repo/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setRepos(res.data);
      } catch (error) {
        console.error("Error while fetching the Repositories", error);
      }
    };

    const fetchSuggesRepos = async () => {
      try {
        const res = await axios.get<RepoRes[]>(
          `http://65.2.122.179:8080/repo/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setSuggesRepo(res.data);
      } catch (error) {
        console.error("Error while fetching the Repositories", error);
      }
    };

    fetchRepos();
    fetchSuggesRepos();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResult(repos);
    } else {
      const filterdRepo = repos.filter((repo) => {
        return repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSearchResult(filterdRepo);
    }
  }, [searchQuery, repos]);

  const handleStar = async (repoId: string) => {
    const token = localStorage.getItem("token");

    try {
      setStarringRepo(repoId);

      const res = await axios.post(
        `http://65.2.122.179:8080/repo/${repoId}/star`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuggesRepo((prevRepos) =>
        prevRepos.map((repo) =>
          repo._id === repoId
            ? {
                ...repo,
                isStarred: res.data.starred,
              }
            : repo,
        ),
      );
    } catch (error) {
      console.error("Error starring repo:", error);
    } finally {
      setStarringRepo(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6">
      <Hero />
      <section className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="col-span-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
              Suggested Repositories
            </h3>

            <div className="space-y-4">
              {suggesRepo.map((repo) => (
                <div
                  key={repo._id}
                  className="border-b border-[#30363d] pb-3 last:border-none"
                >
                  <h4
                    onClick={() => navigate(`/repo/id/${repo._id}`)}
                    className="text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    {repo.name}
                  </h4>

                  <p className="text-sm text-gray-400 mt-1">
                    {repo.description}
                  </p>

                  <Link
                    to={`/userProfile/${repo.owner._id}`}
                    className="text-[#58a6ff] hover:underline"
                  >
                    By {repo.owner.username}
                  </Link>

                  <div className="flex items-center gap-2 mt-3">
                    <button className="px-3 py-1 text-xs font-medium bg-[#238636] rounded-md">
                      Follow
                    </button>

                    <button
                      disabled={starringRepo === repo._id}
                      onClick={() => handleStar(repo._id)}
                      className={`px-3 py-1 text-xs font-medium border rounded-md
                     ${
                       repo.isStarred
                         ? "bg-yellow-500 text-black"
                         : "bg-[#21262d] border-[#30363d] text-white"
                     }
                      ${
                        starringRepo === repo._id
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                    >
                      {starringRepo === repo._id
                        ? "Loading..."
                        : repo.isStarred
                          ? "⭐ Starred"
                          : "⭐ Star"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <h3 className="text-xl font-semibold mt-6 mb-4">
              Your Repositories
            </h3>

            <div className="space-y-4">
              {searchResult.map((repo) => (
                <div
                  key={repo._id}
                  className="border border-[#30363d] rounded-lg p-4 hover:bg-[#1c2128] transition"
                >
                  <h4
                    onClick={() => navigate(`/repo/id/${repo._id}`)}
                    className="text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    {repo.name}
                  </h4>

                  <p className="text-gray-400 mt-2">
                    {repo.description || "No description provided"}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                    <span>{repo.visibility ? "🌍 Public" : "🔒 Private"}</span>

                    <span>
                      Updated {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="col-span-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>

            <ul className="space-y-3 text-gray-300">
              <li className="border-b border-[#30363d] pb-2">
                🚀 Tech Conference - Dec 15
              </li>

              <li className="border-b border-[#30363d] pb-2">
                👨‍💻 Developer Meetup - Dec 25
              </li>

              <li>⚛️ React Summit - Jan 5</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
