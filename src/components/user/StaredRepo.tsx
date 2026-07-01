import { useEffect, useState } from "react";
import axios from "axios";
import { Star, GitFork, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Repo {
  _id: string;
  name: string;
  description: string;
  visibility: boolean;
  starsCount: number;
  isStarred: boolean;
  owner: {
    username: string;
    email: string;
  };
  issues: any[];
  updatedAt: string;
}

export default function StarredRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStarredRepos();
  }, []);

  const fetchStarredRepos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://52.66.237.207:8080/repo/starred", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRepos(res.data);
    } catch (error) {
      console.error("Error fetching starred repos", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="text-xl">Loading starred repositories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            ⭐ Starred Repositories
          </h1>

          <p className="text-gray-400 mt-2">Repositories you've starred.</p>
        </div>

        {/* Stats */}
        <div className="mb-8 bg-[#161b22] border border-[#30363d] rounded-xl p-5">
          <h2 className="text-lg font-semibold">Total Starred Repositories</h2>

          <p className="text-3xl font-bold mt-2">{repos.length}</p>
        </div>

        {/* Empty State */}
        {repos.length === 0 ? (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">⭐</div>

            <h2 className="text-2xl font-semibold">No Starred Repositories</h2>

            <p className="text-gray-400 mt-2">
              Start starring repositories to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo._id}
                className="
                  bg-[#161b22]
                  border border-[#30363d]
                  rounded-xl
                  p-5
                  hover:border-[#58a6ff]
                  transition
                "
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      to={`/repo/id/${repo._id}`}
                      className="
                        text-xl
                        font-semibold
                        text-[#58a6ff]
                        hover:underline
                      "
                    >
                      {repo.name}
                    </Link>

                    <p className="text-gray-400 mt-2">
                      {repo.description || "No description"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                      <span>👤 {repo.owner.username}</span>

                      <span>
                        {repo.visibility ? "🌍 Public" : "🔒 Private"}
                      </span>

                      <span>
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div
                      className="
                        flex items-center gap-2
                        px-3 py-2
                        bg-yellow-500
                        text-black
                        rounded-md
                        font-medium
                      "
                    >
                      <Star size={16} />
                      {repo.starsCount}
                    </div>

                    <div
                      className="
                        flex items-center gap-2
                        px-3 py-2
                        bg-[#21262d]
                        border border-[#30363d]
                        rounded-md
                      "
                    >
                      <AlertCircle size={16} />
                      {repo.issues?.length || 0}
                    </div>

                    <div
                      className="
                        flex items-center gap-2
                        px-3 py-2
                        bg-[#21262d]
                        border border-[#30363d]
                        rounded-md
                      "
                    >
                      <GitFork size={16} />
                      Repo
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
