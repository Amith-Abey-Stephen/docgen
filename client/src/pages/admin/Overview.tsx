import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMembers, useAdminReports } from "@/hooks/use-admin";
import { Users, FileText, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOverview() {
  const { data: members, isLoading: loadingMembers } = useAdminMembers();
  const { data: reports, isLoading: loadingReports } = useAdminReports();

  return (
    <DashboardLayout isAdmin>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">System status and platform analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loadingMembers ? "-" : members?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Generated Reports</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loadingReports ? "-" : reports?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="hover-elevate bg-primary text-primary-foreground border-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">System Status</CardTitle>
              <Activity className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">100%</div>
              <p className="text-xs text-primary-foreground/80 mt-1">Operational & Healthy</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingMembers ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : members?.slice(0, 4).map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-xs bg-secondary px-2 py-1 rounded-full">{member.role}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingReports ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : reports?.slice(0, 4).map(report => (
                <div key={report.id} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{report.title}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>By User #{report.userId}</span>
                    <span>{new Date(report.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
