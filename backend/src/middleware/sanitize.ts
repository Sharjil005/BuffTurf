import { Request, Response, NextFunction } from 'express';

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') return stripTags(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) result[key] = sanitizeObject(obj[key]);
    return result;
  }
  return obj;
}

export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeObject(req.body);
  next();
}