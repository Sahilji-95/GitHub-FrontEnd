import React, { useState } from "react";
import axios from "axios";

export interface IssueFormData {
  title: string;
  description: string;
  status: "open" | "closed";
}

interface CreateIssueProps {
  isOpen: boolean;
  repositoryId: string;
  onClose: () => void;
  onSubmit: (issue: any) => void;
}

const initialForm: IssueFormData = {
  title: "",
  description: "",
  status: "open",
};

const CreateIssue: React.FC<CreateIssueProps> = ({
  isOpen,
  repositoryId,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<IssueFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://65.2.122.179:8080/issue/create",
        {
          title: form.title.trim(),
          description: form.description.trim(),
          status: form.status,
          repository: repositoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onSubmit(response.data);
      setForm(initialForm);
      onClose();
    } catch (error) {
      console.error("Error creating issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#30363d] p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">New Issue</h2>
            <p className="mt-1 text-sm text-[#8b949e]">
              Create an issue for this repository.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-md px-3 py-1 text-xl text-[#8b949e] hover:bg-[#21262d] hover:text-white"
          >
            ×
          </button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Title
            </label>

            <input
              required
              autoFocus
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Bug: Login button not working"
              className="w-full rounded-md border border-[#30363d] bg-[#010409] px-3 py-2 text-white outline-none focus:border-[#1f6feb]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>

            <textarea
              rows={8}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe the issue in detail..."
              className="w-full rounded-md border border-[#30363d] bg-[#010409] px-3 py-2 text-white outline-none focus:border-[#1f6feb]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  status: e.target.value as "open" | "closed",
                }))
              }
              className="w-full rounded-md border border-[#30363d] bg-[#010409] px-3 py-2 text-white outline-none focus:border-[#1f6feb]"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* GitHub Style Info Box */}
          <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-4">
            <p className="text-sm text-[#8b949e]">
              Issues help track bugs, enhancements, and tasks. Use a clear title
              and detailed description to help contributors understand the
              problem.
            </p>
          </div>

          {/* Footer */}
          <footer className="flex justify-end gap-3 border-t border-[#30363d] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#30363d] px-4 py-2 text-sm text-white hover:bg-[#21262d]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!form.title.trim() || loading}
              className="rounded-md bg-[#238636] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2ea043] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Submit Issue"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateIssue;
