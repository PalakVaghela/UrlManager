import { createClient } from "@/lib/supabase/server";

type PublicProfilePageProps = {
  params: Promise<{ handle: string }>;
};

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { handle } = await params;
  const normalizedHandle = handle.trim().toLowerCase();

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user")
    .select("id, handle")
    .eq("handle", normalizedHandle)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-gray-500">User not found.</p>
      </div>
    );
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="mb-2 text-xl font-medium">@{profile.handle}</h1>
      <p className="mb-6 text-sm text-gray-500">Public bookmarks</p>

      <div className="flex w-full max-w-md flex-col gap-3">
        {!bookmarks?.length ? (
          <p className="text-sm text-gray-500">No public bookmarks yet.</p>
        ) : (
          bookmarks.map((bookmark) => (
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
