import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReports } from "@/hooks/use-reports";
import { Search, Download, FileText, CalendarDays } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function History() {
  const { data: reports, isLoading } = useReports();
  const [search, setSearch] = useState("");

  const filteredReports = reports?.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Report History</h1>
          <p className="text-muted-foreground mt-1">View and download your previously generated reports.</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search reports..." 
            className="pl-9 bg-background rounded-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse bg-muted/50 h-[200px]" />
          ))}
        </div>
      ) : filteredReports && filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, i) => (
            <motion.div 
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover-elevate h-full flex flex-col group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-1">{report.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{report.details}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(report.createdAt!).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No reports found</h3>
          <p className="text-muted-foreground">Adjust your search or create a new report.</p>
        </Card>
      )}
    </DashboardLayout>
  );
}
