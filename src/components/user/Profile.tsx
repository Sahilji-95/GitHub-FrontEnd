import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../repo/Navbar";
import { Link } from "react-router-dom";
import HeatMaps from "./HeatMap";

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get<User>("http://65.2.122.179:8080/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
        <div className="text-xl">Loading Profile</div>
      </div>
    );
  }

  if (!user) {
    return <p className="text-red-500">User not found</p>;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Navbar onCreateRepository={() => {}} />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-12">
          {/* Left Sidebar */}
          <aside className="md:col-span-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-4 border-[#30363d] bg-[#161b22] text-6xl font-bold text-[#7d8590]">
                {user.username?.slice(0, 2).toUpperCase()}
              </div>

              <h1 className="mt-4 text-2xl font-semibold">{user.username}</h1>

              <p className="text-[#7d8590]">{user.email}</p>

              <div className="mt-4 flex items-center gap-4 text-sm text-[#7d8590]">
                <button className="hover:text-[#58a6ff]">
                  <span className="font-semibold text-[#e6edf3]">
                    {/* {user.followers?.length ?? 0} */}
                    100
                  </span>{" "}
                  followers
                </button>

                <Link to="/followedUsers">
                  <button className="hover:text-[#58a6ff]">
                    <span className="font-semibold text-[#e6edf3]">
                      {/* {user.following?.length ?? 0} */}
                      10
                    </span>{" "}
                    following
                  </button>
                </Link>
              </div>

              <button className="mt-4 w-full rounded-md border border-[#30363d] bg-[#21262d] px-4 py-2 text-sm hover:bg-[#30363d]">
                Edit profile
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-9">
            <div className="rounded-lg border border-[#30363d] bg-[#161b22]">
              <div className="border-b border-[#30363d] px-6 py-4">
                <h2 className="text-lg font-semibold">Overview</h2>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-4">
                  <p className="mb-1 text-sm text-[#7d8590]">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>

                <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-4">
                  <p className="mb-1 text-sm text-[#7d8590]">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div className="rounded-md border border-[#30363d] bg-[#0d1117] p-4">
                  <p className="mb-1 text-sm text-[#7d8590]">User ID</p>
                  <p className="font-mono text-sm break-all">{user._id}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-8">
        <HeatMaps />
      </div>{" "}
    </div>
  );
}
