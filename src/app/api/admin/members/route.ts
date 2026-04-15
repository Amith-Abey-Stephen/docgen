import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { ensureSeedData, getScopedUsersForAdmin } from "@/lib/storage";

export async function GET() {
  await ensureSeedData();
  const user = await getSessionUser();

  if (!user || !["admin", "super_admin"].includes(user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getScopedUsersForAdmin(user));
}
