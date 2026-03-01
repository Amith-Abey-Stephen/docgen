
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminIndex() {
  return (
    <DashboardLayout isAdmin>
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/admin/members">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
              Members
            </button>
          </Link>

          <Link href="/admin/reports">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
              Reports
            </button>
          </Link>

          <Link href="/admin/overview">
            <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
              Overview
            </button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
