import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import HeatMaps from "./HeatMap";

interface Repo {
  _id: string;
  name: string;
  description: string;
  visibility: boolean;
  updatedAt: string;
  stars: string[];
}

interface UserProfileData {
  user: {
    _id: string;
    username: string;
    email: string;
  };

  repos: Repo[];

  stats: {
    repoCount: number;
    followersCount: number;
    followingCount: number;
    starredCount: number;
  };
}

export default function UserProfile() {
  const { userId } = useParams();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://65.2.122.179:8080/userProfile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setProfile(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
              <div className="w-32 h-32 rounded-full bg-[#21262d] flex items-center justify-center text-5xl font-bold mx-auto">
                {profile.user.username.charAt(0).toUpperCase()}
              </div>

              <h1 className="text-3xl font-bold text-center mt-5">
                {profile.user.username}
              </h1>

              <p className="text-gray-400 text-center mt-2">
                {profile.user.email}
              </p>

              <button className="w-full mt-5 bg-[#21262d] border border-[#30363d] rounded-md py-2 hover:bg-[#30363d] transition">
                Follow
              </button>

              <div className="mt-6 flex justify-center gap-6 text-sm">
                <div>
                  <span className="font-bold">
                    {profile.stats.followersCount}
                  </span>
                  <p className="text-gray-400">Followers</p>
                </div>

                <div>
                  <span className="font-bold">
                    {profile.stats.followingCount}
                  </span>
                  <p className="text-gray-400">Following</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Repositories</p>
                <p className="text-2xl font-bold">{profile.stats.repoCount}</p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Starred</p>
                <p className="text-2xl font-bold">
                  {profile.stats.starredCount}
                </p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-2xl font-bold">
                  {profile.stats.followersCount}
                </p>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <p className="text-gray-400 text-sm">Following</p>
                <p className="text-2xl font-bold">
                  {profile.stats.followingCount}
                </p>
              </div>
            </div>

            {/* Repository List */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl">
              <div className="border-b border-[#30363d] p-4">
                <h2 className="text-xl font-semibold">Repositories</h2>
              </div>

              {profile.repos.length > 0 ? (
                <div className="divide-y divide-[#30363d]">
                  {profile.repos.map((repo) => (
                    <div
                      key={repo._id}
                      className="p-5 hover:bg-[#21262d] transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Link
                            to={`/repo/id/${repo._id}`}
                            className="text-[#58a6ff] text-lg font-semibold hover:underline"
                          >
                            {repo.name}
                          </Link>

                          <p className="text-gray-400 mt-2">
                            {repo.description}
                          </p>

                          <div className="flex gap-4 mt-3 text-sm text-gray-500">
                            <span>
                              {repo.visibility ? "🌍 Public" : "🔒 Private"}
                            </span>

                            <span>
                              Updated{" "}
                              {new Date(repo.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1">
                          ⭐ {repo.stars.length || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-gray-400">
                  No repositories found
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <HeatMaps />
    </div>
  );
}
