import { z } from 'zod';
import { insertReportSchema, reports, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      responses: {
        200: z.object({
          user: z.custom<typeof users.$inferSelect>(),
          token: z.string()
        }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports' as const,
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports' as const,
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  admin: {
    members: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/members' as const,
        responses: {
          200: z.array(z.custom<typeof users.$inferSelect>()),
        }
      }
    },
    reports: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/reports' as const,
        responses: {
          200: z.array(z.custom<typeof reports.$inferSelect>()),
        }
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
