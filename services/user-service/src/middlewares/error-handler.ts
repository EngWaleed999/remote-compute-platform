import { Request, Response, NextFunction } from 'express';
import { AppError } from '@repo/shared-utils';
import { logger } from '../config/logger.js';

export function errorHandler(
  err: Error | AppError, // تقبل النوعين
  req: Request,
  res: Response,
  _next: NextFunction
): void {
 
  // 1. تحديد هل الخطأ معروف (AppError) أم غير متوقع
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const errorCode = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
 
  // الوصول للـ context بأمان حتى لو لم يكتشفه TS في err العادي
  const context = isAppError ? err.context : undefined;

  // 2. التسجيل الذكي في الـ Logs
  if (statusCode >= 500) {
    // أي خطأ 500 أو غير متوقع يذهب لـ debug.log (كـ error)
    logger.error({
      message: err.message,
      code: errorCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
      context: context, // سيسجل الإيميل وأي بيانات أرسلتها
    });
  } else {
    // الأخطاء التشغيلية (400, 401, 409) تذهب لـ info.log (كـ warn)
    logger.warn({
      message: err.message,
      code: errorCode,
      context: context,
    });
  }

  // 3. الرد الموحد للعميل (Client Response)
  res.status(statusCode).json({
    error: errorCode,
    message: isAppError ? err.message : 'An unexpected error occurred',
    // إرسال الـ context فقط في بيئة التطوير للمساعدة في الـ Debugging
    ...(context && process.env.NODE_ENV === 'development' ? { debug_info: context } : {}),
  });
}