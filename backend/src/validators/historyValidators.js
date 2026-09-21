import { z } from 'zod';

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(['url', 'email', 'message']).optional(),
  risk_level: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['safe', 'suspicious', 'malicious', 'unknown']).optional(),
  search: z.string().max(200).optional()
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid scan ID format. Must be a valid UUID.')
});
