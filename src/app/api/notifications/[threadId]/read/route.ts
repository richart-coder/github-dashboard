import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { Octokit } from "@octokit/rest";

export async function PATCH(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    });

    await octokit.activity.markThreadAsRead({
      thread_id: parseInt(params.threadId),
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return new Response(
      JSON.stringify({ error: "Failed to mark notification as read" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
