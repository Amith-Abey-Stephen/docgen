import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminReports } from "@/hooks/use-admin";
import { Search, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const { data: reports, isLoading } = useAdminReports();
  const { toast } = useToast();

  const handleView = () => {
    toast({ title: "View Document", description: "Report details modal would open." });
  };

  return (
    <DashboardLayout isAdmin>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Reports</h1>
          <p className="text-muted-foreground mt-1">System-wide log of generated documents.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search titles..." className="pl-9 bg-background" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="pl-6 py-4">Title</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Excerpt</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : reports?.map(report => (
                <TableRow key={report.id} className="hover:bg-muted/30">
                  <TableCell className="pl-6 py-4 font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> {report.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">User #{report.userId}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(report.createdAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                    {report.details}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" onClick={handleView}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
