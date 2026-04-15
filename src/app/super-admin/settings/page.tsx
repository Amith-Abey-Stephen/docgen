"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAuditLogs, useSiteSettings, useUpdateSiteSettings } from "@/hooks/use-super-admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { SiteSettings } from "@/lib/schema";

export default function SuperAdminSettingsPage() {
  const { user, isLoading } = useRequireAuth(false, true);
  const { toast } = useToast();
  const { data: settings, isLoading: loadingSettings } = useSiteSettings();
  const { data: logs, isLoading: loadingLogs } = useAuditLogs(50);
  const updateSettings = useUpdateSiteSettings();
  const [form, setForm] = useState<
    Pick<
      SiteSettings,
      | "platformName"
      | "supportEmail"
      | "defaultOrganizationName"
      | "maintenanceMode"
      | "allowPublicSignup"
      | "defaultUserRole"
      | "requireOrganizationForUsers"
    >
  >({
    platformName: "",
    supportEmail: "",
    defaultOrganizationName: "",
    maintenanceMode: false,
    allowPublicSignup: true,
    defaultUserRole: "member",
    requireOrganizationForUsers: false,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        defaultOrganizationName: settings.defaultOrganizationName,
        maintenanceMode: settings.maintenanceMode,
        allowPublicSignup: settings.allowPublicSignup,
        defaultUserRole: settings.defaultUserRole,
        requireOrganizationForUsers: settings.requireOrganizationForUsers,
      });
    }
  }, [settings]);

  if (isLoading || !user) {
    return <div className="p-8 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <DashboardLayout mode="super_admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Settings</h1>
        <p className="mt-1 text-muted-foreground">Reserved for global site settings and platform-wide configuration.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSettings ? (
              <div className="text-muted-foreground">Loading settings...</div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={async (event) => {
                  event.preventDefault();
                  try {
                    await updateSettings.mutateAsync(form);
                    toast({ title: "Settings saved", description: "Platform configuration has been updated." });
                  } catch (error) {
                    toast({
                      title: "Save failed",
                      description: error instanceof Error ? error.message : "Unable to save settings",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="platformName">Platform name</Label>
                    <Input
                      id="platformName"
                      value={form.platformName}
                      onChange={(event) => setForm((current) => ({ ...current, platformName: event.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={form.supportEmail}
                      onChange={(event) => setForm((current) => ({ ...current, supportEmail: event.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="defaultOrganizationName">Default organization name</Label>
                  <Input
                    id="defaultOrganizationName"
                    value={form.defaultOrganizationName}
                    onChange={(event) => setForm((current) => ({ ...current, defaultOrganizationName: event.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultUserRole">Default signup role</Label>
                  <select
                    id="defaultUserRole"
                    value={form.defaultUserRole}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        defaultUserRole: event.target.value as SiteSettings["defaultUserRole"],
                      }))
                    }
                    className="h-10 w-full rounded-md border px-3"
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Maintenance mode</p>
                      <p className="text-sm text-muted-foreground">Temporarily block login while platform maintenance is active.</p>
                    </div>
                    <Switch checked={form.maintenanceMode} onCheckedChange={(checked) => setForm((current) => ({ ...current, maintenanceMode: checked }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Allow public signup</p>
                      <p className="text-sm text-muted-foreground">Control whether users can self-register.</p>
                    </div>
                    <Switch checked={form.allowPublicSignup} onCheckedChange={(checked) => setForm((current) => ({ ...current, allowPublicSignup: checked }))} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">Require organization for users</p>
                      <p className="text-sm text-muted-foreground">Force new users to be created only with organization assignment.</p>
                    </div>
                    <Switch
                      checked={form.requireOrganizationForUsers}
                      onCheckedChange={(checked) => setForm((current) => ({ ...current, requireOrganizationForUsers: checked }))}
                    />
                  </div>
                </div>
                <Button type="submit">Save Settings</Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingLogs ? (
              <div className="text-muted-foreground">Loading activity...</div>
            ) : (
              logs?.map((log) => (
                <div key={log.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{log.message}</p>
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.action} | {log.entityType} | {log.actorEmail ?? "system"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
