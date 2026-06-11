import { createClient } from "@/lib/supabase/server";
import { Link2, ExternalLink, ShieldAlert, FolderHeart } from "lucide-react";

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

  // Profile not found
  if (!profile) {
    return (
      <div className="relative flex min-h-[80vh] flex-1 flex-col items-center justify-center p-6 bg-[#0B0F19] text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-xl mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Account not found</h2>
        <p className="mt-1.5 text-sm text-gray-400 max-w-xs text-center">
          The handle <span className="font-mono text-indigo-400 font-semibold">@{handle}</span> does not exist or has been removed.
        </p>
      </div>
    );
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  // Normal active user page layout
  return (
    <div className="relative flex min-h-screen flex-1 flex-col bg-[#0B0F19] text-white overflow-hidden">
      <div className="absolute top-0 left-1/2 -z-10 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/5 blur-[120px]" />

      <header className="border-b border-gray-800/60 bg-gray-900/20 px-6 py-8 text-center backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-xl shadow-indigo-500/10">
          <span className="text-2xl font-extrabold uppercase tracking-wider text-white">
            {profile.handle.charAt(0)}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
          @{profile.handle}
        </h1>
        <p className="mt-1 text-xl font-bold text-gray-400">
          Public links collection
        </p>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {!bookmarks?.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-800/40 bg-gray-900/10 p-12 text-center backdrop-blur-sm">
            <FolderHeart className="h-8 w-8 text-gray-600" />
            <p className="mt-3 text-sm text-gray-400">No public links shared here yet.</p>
          </div>

        ) : (

          <div className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="group relative flex w-full flex-col justify-between rounded-2xl border border-gray-700/80 bg-[#161D2E] p-5 shadow-md backdrop-blur-sm transition-all hover:border-gray-600/80 hover:bg-[#1B2338]"
              >
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-semibold text-gray-100 tracking-tight text-base sm:text-lg line-clamp-2">
                    {bookmark.title || "Untitled Link"}
                  </h4>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-mono text-indigo-400 hover:text-indigo-300 hover:underline break-all w-fit"
                  >
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-gray-600" />
                    {bookmark.url}
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        )}
      </main>

    </div>
  );
}
