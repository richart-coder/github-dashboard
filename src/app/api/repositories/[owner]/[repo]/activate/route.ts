import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) {
    return new NextResponse("User not found", { status: 404 });
  }

  const { owner, repo } = params;
  const repository = `${owner}/${repo}`;

  await prisma.repositoryPreference.updateMany({
    where: { userId: dbUser.id },
    data: { isActive: false },
  });

  await prisma.repositoryPreference.upsert({
    where: {
      userId_repository: {
        userId: dbUser.id,
        repository,
      },
    },
    create: {
      userId: dbUser.id,
      repository,
      isActive: true,
      ignoredTypes: JSON.stringify(["Issue", "PullRequest", "Commit"]),
    },
    update: {
      isActive: true,
    },
  });

  return new NextResponse("OK", { status: 200 });
}
