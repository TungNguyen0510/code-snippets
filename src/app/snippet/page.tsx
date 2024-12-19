import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";
import { ConvexHttpClient } from "convex/browser";
import { currentUser } from "@clerk/nextjs/server";
import { api } from "../../../convex/_generated/api";
import Header from "@/components/Header";
import ResizableSplitView from "@/components/ResizableSplitView";

export default async function SnippetPage() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <Header />
      <div className="max-w-[1800px] mx-auto p-4">
        <ResizableSplitView
          leftComponent={<EditorPanel convexUser={convexUser} />}
          rightComponent={<OutputPanel />}
        />
      </div>
    </div>
  );
}
