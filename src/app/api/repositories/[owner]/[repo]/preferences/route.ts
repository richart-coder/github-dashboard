import { updateRepositoryPreferenceTypes } from "@/repositories/repo-preference";
import { typesSchema } from "@/types/zod/notification";
import validateSession from "@/services/auth";

export async function PUT(
  request: Request,
  context: { params: { owner: string; repo: string } }
) {
  try {
    const { session } = await validateSession();
    const { owner, repo } = await context.params;
    const [userId, repoName] = [session.user?.id!, `${owner}/${repo}`];
    const body = await request.json();
    const result = typesSchema.safeParse(body.types);
    if (result.error) {
      console.error(result.error.issues);

      return Response.json(
        {
          data: null,
          error: {
            message: "無法更新通知偏好設定",
          },
        },
        { status: 400 }
      );
    }
    const preference = await updateRepositoryPreferenceTypes(
      userId,
      repoName,
      body.types
    );
    return Response.json({
      data: preference,
    });
  } catch (error) {
    return Response.json({ data: null, error }, { status: 500 });
  }
}
