import { updateRepositoryPreferenceIgnoreTypes } from "@/repositories/repo-preference";

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

    const preference = await updateRepositoryPreferenceIgnoreTypes(
      userId,
      repoName,
      body.ignoredTypes
    );
    return Response.json({
      data: preference,
    });
  } catch (error) {
    return Response.json({ data: null, error }, { status: 500 });
  }
}
