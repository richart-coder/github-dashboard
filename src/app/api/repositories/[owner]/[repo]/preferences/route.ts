import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { isActive, ignoredTypes } = body;
    const repository = `${params.owner}/${params.repo}`;

    let finalIgnoredTypes: string | undefined = undefined;
    if (Array.isArray(ignoredTypes)) {
      finalIgnoredTypes = JSON.stringify(ignoredTypes);
    } else if (typeof ignoredTypes === "string") {
      finalIgnoredTypes = ignoredTypes;
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!dbUser) return new Response("User not found", { status: 404 });

    const updateData: Record<string, any> = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (finalIgnoredTypes !== undefined)
      updateData.ignoredTypes = finalIgnoredTypes;

    if (Object.keys(updateData).length === 0) {
      return new Response("No valid fields to update", { status: 400 });
    }

    const preference = await prisma.repositoryPreference.upsert({
      where: {
        userId_repository: {
          userId: dbUser.id,
          repository,
        },
      },
      update: updateData,
      create: {
        userId: dbUser.id,
        repository,
        isActive: updateData.isActive ?? false,
        ignoredTypes: updateData.ignoredTypes ?? "Issue,PullRequest,Commit",
      },
    });

    return Response.json({
      ...preference,
      ignoredTypes: preference.ignoredTypes.split(","),
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
