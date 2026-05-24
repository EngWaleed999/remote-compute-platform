/**
 * Winston Logger Configuration
 * Centralized logging for the user-service.
 * - Development: colorized console output
 * - Production: JSON format for log aggregation
 */
import winston from 'winston';
import { env } from './env.js';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

// Human-readable format for development
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level}]: ${stack || message}${metaStr}`;
  })
);

// Structured JSON format for production
const prodFormat = combine(
  timestamp(),
  colorize(),
  errors({ stack: true }),
  json()
);
const transports = [
  new winston.transports.File({
    filename: './logs/debug.log',
    level: 'debug',
  }),
  new winston.transports.File({
    filename: './logs/info.log',
    level: 'info',
  }),
];

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  defaultMeta: { service: 'user-service' },
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: transports,
  // Don't exit on uncaught exceptions — let the error handler deal with it
  exitOnError: false,
});
