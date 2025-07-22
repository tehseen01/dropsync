import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { HomePage } from "@/components/features";
import FilesList from "@/components/features/home/files-list";

const getCurrentUserFiles = async () => {
  const supabase = await createClient();
  try {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
      console.error("Error fetching user:", userError);
      return [];
    }

    const userId = user.user.id;

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .or(`receiver_id.eq.${userId},user_id.eq.${userId}`);

    if (!data || error) {
      console.error("Error fetching files:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error getCurrentUserFiles:", error);
    return [];
  }
};

const Home = async () => {
  const files = await getCurrentUserFiles();

  return (
    <main className="min-h-[calc(100dvh-8rem)]">
      <section className="w-full pt-12 md:pt-16 lg:pt-18 xl:pt-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Share Files Instantly with QR Codes
              </h1>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                No account needed. Generate a QR code, let others scan and
                upload, receive files instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
      <HomePage />
      <Suspense fallback={<div className="text-center">Loading files...</div>}>
        {files && files.length > 0 && <FilesList files={files} />}
      </Suspense>
      {/* Add any additional components or sections here */}
    </main>
  );
};

export default Home;
