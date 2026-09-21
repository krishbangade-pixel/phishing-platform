import { z } from 'zod';

export const urlScanSchema = z.object({
  url: z.string({
    required_error: 'URL is required'
  })
  .min(1, 'URL cannot be empty')
  .max(2048, 'URL exceeds maximum length of 2048 characters')
  .trim()
});

export const emailScanSchema = z.object({
  subject: z.string().max(500, 'Subject exceeds maximum length of 500 characters').optional().default(''),
  content: z.string({
    required_error: 'Email content is required'
  })
  .min(1, 'Email content cannot be empty')
  .max(20000, 'Email content exceeds maximum length of 20000 characters'),
  sender: z.string().max(320, 'Sender email exceeds maximum length').optional().default(''),
  replyTo: z.string().max(320, 'Reply-To email exceeds maximum length').optional().default('')
});

export const messageScanSchema = z.object({
  content: z.string({
    required_error: 'Message content is required'
  })
  .min(1, 'Message content cannot be empty')
  .max(10000, 'Message content exceeds maximum length of 10000 characters')
});
