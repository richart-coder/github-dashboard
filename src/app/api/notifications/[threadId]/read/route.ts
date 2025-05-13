import { markNotificationAsRead } from "@/services/octokit";
import validateSession from "@/services/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const { session } = await validateSession();
    const result = await markNotificationAsRead(
      session,
      parseInt(params.threadId)
    );
    return Response.json({ data: result.data });
  } catch (error) {
    return Response.json(
      { data: null, error },
      {
        status: 500,
      }
    );
  }
}
