export interface AppErrorOptions {
  name?: string;
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  isCatastrophic?: boolean;
}

export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
  isCatastrophic: boolean;
  constructor(message: any, options: any = {}) {
    super(message);
    this.name = options.name || 'AppError';
    this.statusCode = options.statusCode || 500;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.isOperational = options.isOperational ?? true;
    this.isCatastrophic = options.isCatastrophic ?? false;
  }
}
