import { markNotificationAsRead } from "@/services/octokit";
import validateSession from "@/services/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  const { session } = await validateSession();
  try {
    const result = await markNotificationAsRead(
      session,
      parseInt(params.threadId)
    );
    return Response.json({ data: result });
  } catch (error) {
    console.error("標記通知已讀失敗:", error);
    return Response.json(
      { data: null, error: { message: "無法將通知標記為已讀" } },
      {
        status: 500,
      }
    );
  }
}
