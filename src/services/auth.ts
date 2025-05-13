import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";

export default async function validateSession(redirectTo: string = "/") {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(redirectTo);
  }

  return {
    session,
  };
}
