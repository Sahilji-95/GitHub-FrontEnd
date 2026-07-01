import React, { useState } from "react";
import axios from "axios";

export interface RepositoryFormData {
  name: string;
  description: string;
  content: string;
  visibility: boolean;
}

interface CreateRepositoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (repository: any) => void;
}

const initialForm: RepositoryFormData = {
  name: "",
  description: "",
  content: "",
  visibility: false,
};

const CreateRepo: React.FC<CreateRepositoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<RepositoryFormData>(initialForm);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/repo/create",
        {
          name: form.name.trim(),
          description: form.description.trim(),
          content: form.content,
          visibility: form.visibility,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Repository Created:", response.data);

      onSubmit(response.data);

      setForm(initialForm);
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating repository:",
          error.response?.data || error.message,
        );
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-repository-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-gray-700 bg-gray-900 shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-gray-700 p-6">
          <div>
            <h2
              id="create-repository-title"
              className="text-xl font-semibold text-white"
            >
              Create a new repository
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Enter the details for your repository.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-xl text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Repository name
            </label>

            <input
              required
              autoFocus
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="my-awesome-project"
              className="w-full rounded-md border border-gray-600 bg-gray-950 px-3 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Description
            </label>

            <input
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your repository"
              className="w-full rounded-md border border-gray-600 bg-gray-950 px-3 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Initial content
            </label>

            <textarea
              rows={5}
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="# My Project"
              className="w-full rounded-md border border-gray-600 bg-gray-950 px-3 py-2 text-white outline-none focus:border-blue-500"
            />
          </div>

          <label className="flex gap-3 rounded-lg border border-gray-700 bg-gray-950 p-4">
            <input
              type="checkbox"
              checked={form.visibility}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  visibility: e.target.checked,
                }))
              }
            />

            <div>
              <p className="text-white">Public repository</p>
              <p className="text-sm text-gray-400">
                Disable this option to make the repository private.
              </p>
            </div>
          </label>

          <footer className="flex justify-end gap-3 border-t border-gray-700 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!form.name.trim() || loading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Repository"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CreateRepo;
