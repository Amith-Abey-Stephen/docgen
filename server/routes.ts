import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed mock data
  const seedMockData = async () => {
    try {
      const existingUsers = await storage.getUsers();
      if (existingUsers.length === 0) {
        await storage.createUser({ email: 'admin@example.com', password: 'password', name: 'Admin User', role: 'admin' });
        await storage.createUser({ email: 'member@example.com', password: 'password', name: 'Member User', role: 'member' });
      }
      const existingReports = await storage.getReports();
      if (existingReports.length === 0) {
        await storage.createReport({ userId: 2, title: 'Q1 Performance', details: 'Analyze Q1 sales and marketing performance.' });
        await storage.createReport({ userId: 2, title: 'Employee Satisfaction', details: 'Summarize the recent survey results.' });
      }
    } catch(e) {
      console.error(e);
    }
  };
  
  await seedMockData();

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByEmail(input.email);
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.json({ user, token: 'mock-jwt-token' });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.reports.list.path, async (req, res) => {
    // In a real app we'd get user ID from token. Mocking it here.
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      const report = await storage.createReport(input);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get(api.admin.members.list.path, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get(api.admin.reports.list.path, async (req, res) => {
    const reports = await storage.getReports();
    res.json(reports);
  });

  return httpServer;
}