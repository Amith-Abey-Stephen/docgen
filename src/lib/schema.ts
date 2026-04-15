import { z } from "zod";

export const roleSchema = z.enum(["member", "admin", "super_admin"]);

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().min(1),
  role: roleSchema.default("member").optional(),
  organizationId: z.string().optional(),
});

export const insertReportSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  details: z.string().min(1),
});

export const insertOrganizationSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = Omit<InsertUser, "role"> & { id: string; role: z.infer<typeof roleSchema> };

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = InsertReport & { id: string; content: string; createdAt: string };

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = InsertOrganization & { id: string; createdAt: string };

export type SuperAdminStats = {
  totalUsers: number;
  totalOrganizations: number;
  totalReports: number;
  totalMembers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
  activeOrganizations: number;
};

export const siteSettingsSchema = z.object({
  platformName: z.string().min(1),
  supportEmail: z.string().email(),
  defaultOrganizationName: z.string().min(1),
  maintenanceMode: z.boolean().default(false),
  allowPublicSignup: z.boolean().default(true),
  defaultUserRole: roleSchema.default("member"),
  requireOrganizationForUsers: z.boolean().default(false),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema> & {
  id: string;
  updatedAt: string;
};

export type AuditLog = {
  id: string;
  actorUserId?: string;
  actorEmail?: string;
  actorRole?: z.infer<typeof roleSchema>;
  action: string;
  entityType: "user" | "organization" | "site_settings" | "auth";
  entityId?: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type AnalyticsSeriesPoint = {
  name: string;
  value: number;
};

export type ReportsTimelinePoint = {
  date: string;
  reports: number;
};

export type SuperAdminAnalytics = {
  roleBreakdown: AnalyticsSeriesPoint[];
  organizationStatus: AnalyticsSeriesPoint[];
  reportsTimeline: ReportsTimelinePoint[];
};
