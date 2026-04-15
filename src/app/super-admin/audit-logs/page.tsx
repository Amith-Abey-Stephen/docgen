"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/hooks/use-auth";
import { useAuditLogs } from "@/hooks/use-super-admin";

export default function SuperAdminAuditLogsPage() {
  const { user, isLoading: authLoading } = useRequireAuth(false, true);
  const { data: logs, isLoading } = useAuditLogs(200);
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return (logs ?? []).filter((log) => {
      const haystack = `${log.message} ${log.action} ${log.entityType} ${log.actorEmail ?? ""}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [logs, search]);

  if (authLoading || !user) {
    return <div className="p-8 text-muted-foreground">Loading audit logs...</div>;
  }

  return (
    <DashboardLayout mode="super_admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="mt-1 text-muted-foreground">Review platform history and administrative activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search logs..." value={search} onChange={(event) => setSearch(event.target.value)} />
          {isLoading ? (
            <div className="text-muted-foreground">Loading logs...</div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.action} · {log.entityType} · {log.actorEmail ?? "system"} · {log.actorRole ?? "system"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
