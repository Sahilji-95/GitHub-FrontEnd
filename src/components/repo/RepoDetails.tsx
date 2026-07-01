import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import CreateIssue from "../issue/CreateIssue";

interface Issue {
  _id: string;
  title: string;
  description: string;
}

interface Repo {
  _id: string;
  name: string;
  description: string;
  content: string[];
  visibility: boolean;
  owner: {
    username: string;
    email: string;
    _id: string;
  };
  issues: Issue[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  starsCount: number;
}

export default function RepoDetails() {
  const { repoId } = useParams();
  const token = localStorage.getItem("token");

  const [repo, setRepo] = useState<Repo | null>(null);
  const [starringRepo, setStarringRepo] = useState<string | null>(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`52.66.237.207:8080/repo/id/${repoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRepo(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRepo();
  }, [repoId]);

  if (!repo) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="text-xl">Loading Repository Details </div>
      </div>
    );
  }

  const handleStar = async (repoId: string) => {
    const token = localStorage.getItem("token");

    try {
      setStarringRepo(repoId);

      const res = await axios.post(
        `52.66.237.207:8080/repo/${repoId}/star`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRepo((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          isStarred: res.data.starred,
          starsCount: res.data.starsCount,
        };
      });
    } catch (error) {
      console.error("Error starring repo:", error);
    } finally {
      setStarringRepo(null);
    }
  };
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Repository Header */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">{repo.name}</h1>

              <p className="mt-3 text-gray-400 text-lg">
                {repo.description || "No description provided"}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-[#21262d] border border-[#30363d] rounded-full text-sm">
                  👤{" "}
                  <Link
                    to={`/userProfile/${repo.owner._id}`}
                    className="text-[#58a6ff] hover:underline"
                  >
                    {repo.owner.username}
                  </Link>
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm border ${
                    repo.visibility
                      ? "bg-green-900/30 text-green-400 border-green-700"
                      : "bg-red-900/30 text-red-400 border-red-700"
                  }`}
                >
                  {repo.visibility ? "🌍 Public" : "🔒 Private"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                className="
                   flex items-center gap-2
                   px-5 py-2.5
                   bg-blue-600
                   hover:bg-blue-700
                   rounded-md
                   font-medium
                   transition
                 "
              >
                👤 Follow
              </button>
              <button
                disabled={starringRepo === repo._id}
                onClick={() => handleStar(repo._id)}
                className={`
                      flex items-center gap-2
                      px-5 py-2.5
                      rounded-md
                      font-medium
                      transition-all
                      duration-200
                      border
                      ${
                        repo.isStarred
                          ? "bg-yellow-500 text-black border-yellow-500 hover:bg-yellow-400"
                          : "bg-[#21262d] text-white border-[#30363d] hover:bg-[#30363d]"
                      }
                      ${
                        starringRepo === repo._id
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
              >
                {starringRepo === repo._id ? (
                  <>
                    <span className="animate-spin">⭐</span>
                    Processing...
                  </>
                ) : repo.isStarred ? (
                  <>⭐ Starred</>
                ) : (
                  <>☆ Star</>
                )}
              </button>

              <div
                className="
              flex items-center gap-2
              px-4 py-2
              bg-[#21262d]
              border border-[#30363d]
              rounded-md
            "
              >
                🐞
                <span>{repo.issues?.length || 0}</span>
              </div>

              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="
              flex items-center gap-2
              px-4 py-2
              bg-green-600
              hover:bg-green-700
              rounded-md
              transition
            "
              >
                ➕ Create Issue
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-5 border-t border-[#30363d] grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#21262d] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Stars</p>
              <p className="text-xl font-bold">{repo.starsCount}</p>
            </div>
            <div className="bg-[#21262d] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Issues</p>
              <p className="text-xl font-bold">{repo.issues?.length || 0}</p>
            </div>

            <div className="bg-[#21262d] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Created</p>
              <p className="text-sm font-medium">
                {new Date(repo.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-[#21262d] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Updated</p>
              <p className="text-sm font-medium">
                {new Date(repo.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#30363d] flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              🐞 Issues ({repo.issues?.length || 0})
            </h2>

            <button
              className="
            px-4 py-2
            bg-green-600
            hover:bg-green-700
            rounded-md
            text-sm
          "
            >
              New Issue
            </button>
          </div>

          {repo.issues?.length > 0 ? (
            <div className="divide-y divide-[#30363d]">
              {repo.issues.map((issue: any) => (
                <div
                  key={issue._id}
                  className="p-4 hover:bg-[#21262d] transition"
                >
                  <h3 className="font-medium">{issue.title}</h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {issue.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No issues found.
            </div>
          )}
        </div>

        {/* Repository Files */}
        <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#30363d]">
            <h2 className="text-xl font-semibold">📂 Repository Content</h2>
          </div>

          {repo.content?.length > 0 ? (
            <div className="divide-y divide-[#30363d]">
              {repo.content.map((item: string, index: number) => (
                <div
                  key={index}
                  className="
                px-6 py-4
                hover:bg-[#21262d]
                transition
                cursor-pointer
              "
                >
                  <div className="flex items-center gap-3">
                    <span>📄</span>

                    <span className="font-mono text-sm">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No files available.
            </div>
          )}
        </div>
      </div>
      <CreateIssue
        isOpen={isIssueModalOpen}
        repositoryId={repo._id}
        onClose={() => setIsIssueModalOpen(false)}
        onSubmit={(newIssue) => {
          setRepo((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              issues: [newIssue, ...prev.issues],
            };
          });

          setIsIssueModalOpen(false);
        }}
      />
    </div>
  );
}
