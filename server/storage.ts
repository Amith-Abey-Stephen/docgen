import { type User, type InsertUser, type Report, type InsertReport } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getReports(): Promise<Report[]>;
  getReportsByUser(userId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  getUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, Report>;
  private currentUserId: number = 1;
  private currentReportId: number = 1;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, role: insertUser.role ?? 'member' };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(r => r.userId === userId);
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = { 
      ...insertReport, 
      id, 
      content: "This is a mock generated report content based on your details: " + insertReport.details,
      createdAt: new Date()
    };
    this.reports.set(id, report);
    return report;
  }
}

export const storage = new MemStorage();