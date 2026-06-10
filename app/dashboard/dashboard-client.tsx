"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBookmark,
  deleteBookmark,
  updateBookmark,
  type BookmarkState,
} from "@/app/dashboard/actions";
import type { Bookmark } from "@/types/bookmark";

const initialState: BookmarkState = {};

type DashboardClientProps = {
  bookmarks: Bookmark[];
};

export default function DashboardClient({ bookmarks }: DashboardClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [createState, createAction, isCreating] = useActionState(
    createBookmark,
    initialState,
  );
  const [updateState, updateAction, isUpdating] = useActionState(
    updateBookmark,
    initialState,
  );
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteBookmark,
    initialState,
  );

  useEffect(() => {
    if (createState.success) {
      setShowForm(false);
      router.refresh();
    }
  }, [createState.success, router]);

  useEffect(() => {
    if (updateState.success) {
      setEditingId(null);
      router.refresh();
    }
  }, [updateState.success, router]);

  useEffect(() => {
    if (deleteState.success) {
      router.refresh();
    }
  }, [deleteState.success, router]);

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="mb-4 text-xl font-medium">Dashboard</h1>

      <button
        type="button"
        onClick={() => setShowForm((open) => !open)}
        className="w-fit rounded bg-gray-900 px-4 py-2 text-sm text-white"
      >
        Add
      </button>

      {showForm ? (
        <form
          key={createState.success ? "reset" : "active"}
          action={createAction}
          className="mt-4 flex w-full max-w-md flex-col gap-4 rounded border border-gray-300 p-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              name="title"
              type="text"
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            URL
            <input
              name="url"
              type="url"
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input name="is_public" type="checkbox" className="h-4 w-4" />
            Public
          </label>

          {createState.error ? (
            <p className="text-sm text-red-600">{createState.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isCreating}
            className="w-fit rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </form>
      ) : null}

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <h2 className="text-lg font-medium">Your bookmarks</h2>

        {updateState.error ? (
          <p className="text-sm text-red-600">{updateState.error}</p>
        ) : null}

        {deleteState.error ? (
          <p className="text-sm text-red-600">{deleteState.error}</p>
        ) : null}

        {bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500">No bookmarks yet.</p>
        ) : (
          bookmarks.map((bookmark) =>
            editingId === bookmark.id ? (
              <form
                key={bookmark.id}
                action={updateAction}
                className="flex flex-col gap-3 rounded border border-gray-300 p-4"
              >
                <input type="hidden" name="id" value={bookmark.id} />

                <label className="flex flex-col gap-1 text-sm">
                  Title
                  <input
                    name="title"
                    type="text"
                    defaultValue={bookmark.title}
                    className="rounded border border-gray-300 px-3 py-2"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                  URL
                  <input
                    name="url"
                    type="url"
                    defaultValue={bookmark.url}
                    className="rounded border border-gray-300 px-3 py-2"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    name="is_public"
                    type="checkbox"
                    defaultChecked={bookmark.is_public}
                    className="h-4 w-4"
                  />
                  Public
                </label>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={bookmark.id}
                className="rounded border border-gray-300 p-4"
              >
                <p className="font-medium">{bookmark.title}</p>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {bookmark.url}
                </a>
                <p className="mt-1 text-xs text-gray-500">
                  {bookmark.is_public ? "Public" : "Private"}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(bookmark.id)}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    Edit
                  </button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={bookmark.id} />
                    <button
                      type="submit"
                      disabled={isDeleting}
                      className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
