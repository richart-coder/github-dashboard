import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth-config";
import { Octokit } from "@octokit/rest";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const octokit = new Octokit({
      auth: session.accessToken,
    });

    const { data } =
      await octokit.activity.listNotificationsForAuthenticatedUser({
        all: true,
        participating: false,
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        before: new Date().toISOString(),
      });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
