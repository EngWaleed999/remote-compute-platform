export interface AppErrorOptions {
  name?: string;
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  isCatastrophic?: boolean;
  context?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly isCatastrophic: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = options.name || 'AppError';
    this.statusCode = options.statusCode || 500;
    this.code = options.code || 'UNKNOWN_ERROR';
    this.isOperational = options.isOperational ?? true;
    this.isCatastrophic = options.isCatastrophic ?? false;
    this.context = options.context;
  }
}
