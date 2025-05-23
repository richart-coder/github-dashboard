import { setActiveRepository } from "@/repositories/repo-preference";

import validateSession from "@/services/auth";
export async function PUT(
  request: Request,
  context: { params: { owner: string; repo: string } }
) {
  const { session } = await validateSession();
  const { owner, repo } = await context.params;
  const [userId, repository] = [session.user.id, `${owner}/${repo}`];
  try {
    const result = await setActiveRepository(userId, repository);
    return Response.json({ data: result[1] });
  } catch (error) {
    console.error("無法啟用儲存庫", error);
    return Response.json(
      { data: null, error: { message: "無法啟用儲存庫" } },
      { status: 500 }
    );
  }
}
