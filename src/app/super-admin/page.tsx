"use client";

import { Activity, BarChart3, Building2, ShieldCheck, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-auth";
import { useSuperAdminOrganizations, useSuperAdminStats, useSuperAdminUsers } from "@/hooks/use-super-admin";

export default function SuperAdminOverviewPage() {
  const { user, isLoading: authLoading } = useRequireAuth(false, true);
  const { data: stats, isLoading: loadingStats } = useSuperAdminStats();
  const { data: users } = useSuperAdminUsers();
  const { data: organizations } = useSuperAdminOrganizations();

  if (authLoading || !user) {
    return <div className="p-8 text-muted-foreground">Loading super admin overview...</div>;
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers ?? "-", icon: Users },
    { title: "Organizations", value: stats?.totalOrganizations ?? "-", icon: Building2 },
    { title: "Reports", value: stats?.totalReports ?? "-", icon: BarChart3 },
    { title: "Super Admins", value: stats?.totalSuperAdmins ?? "-", icon: ShieldCheck },
  ];

  return (
    <DashboardLayout mode="super_admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Control Center</h1>
        <p className="mt-1 text-muted-foreground">Manage the full platform: users, organizations, analytics, and system-level access.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.title} className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loadingStats ? "-" : item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users?.slice(0, 5).map((managedUser) => (
              <div key={managedUser.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {managedUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{managedUser.name}</p>
                    <p className="text-sm text-muted-foreground">{managedUser.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-secondary px-2 py-1 text-xs">{managedUser.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {organizations?.slice(0, 5).map((organization) => (
              <div key={organization.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{organization.name}</p>
                    <p className="text-sm text-muted-foreground">{organization.slug}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-1 text-xs ${organization.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {organization.isActive ? "active" : "inactive"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
