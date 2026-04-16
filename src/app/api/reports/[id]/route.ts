import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { deleteReport, ensureSeedData } from "@/lib/storage";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureSeedData();
  const user = await getSessionUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteReport(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
