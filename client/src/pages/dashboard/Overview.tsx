import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useReports } from "@/hooks/use-reports";
import { FileText, TrendingUp, Clock, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function MemberOverview() {
  const { user } = useAuth();
  const { data: reports, isLoading } = useReports();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your reports today.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="rounded-xl shadow-md hover:shadow-lg transition-all gap-2">
            <PlusCircle className="w-4 h-4" />
            New Report
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "-" : reports?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
              <Clock className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12.5 hrs</div>
              <p className="text-xs text-muted-foreground mt-1">Estimated this month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Productivity Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground mt-1">+4% from last week</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <Card className="overflow-hidden">
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading activity...</div>
          ) : reports && reports.length > 0 ? (
            reports.slice(0, 3).map((report, i) => (
              <div key={report.id} className="p-4 hover:bg-secondary/40 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{report.title}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">{report.details}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(report.createdAt!).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">No reports generated yet. Create your first one!</div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}
