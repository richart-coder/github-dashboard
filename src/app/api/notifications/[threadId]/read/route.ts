import { markNotificationAsRead } from "@/services/octokit";
import validateSession from "@/services/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const { session } = await validateSession();
    await markNotificationAsRead(session, parseInt(params.threadId));
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "無法將通知設為已讀狀態" }), {
      status: 500,
    });
  }
}
