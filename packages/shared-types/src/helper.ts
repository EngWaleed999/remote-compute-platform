// import { components, paths } from './api-schema.js';
// // import {AppError} from '@repo/shared-utils'
// // export type Body<
// //   T extends keyof paths,
// //   M extends 'post' | 'get' | 'put' | 'delete' | 'patch',
// // > = paths[T][M] extends {
// //   requestBody: {
// //     content: {
// //       'application/json': infer R;
// //     };
// //   };
// // }
// //   ? R
// //   : never;

// // export type Success<
// //   T extends keyof paths,
// //   M extends keyof paths[T],
// // > = paths[T][M] extends {
// //   responses: {
// //     201: {
// //       content: {
// //         'application/json': infer R;
// //       };
// //     };
// //   };
// // }
// //   ? R
// //   : paths[T][M] extends {
// //         responses: {
// //           200: {
// //             content: {
// //               'application/json': infer R;
// //             };
// //           };
// //         };
// //       }
// //     ? R
// //     : never;

// // export type ErrorResponse<
// //   T extends keyof paths,
// //   M extends keyof paths[T],
// // > = paths[T][M] extends {
// //   responses: {
// //     400: {
// //       content: {
// //         'application/json': infer R;
// //       };
// //     };
// //   };
// // }
// //   ? R
// //   : never;

// // export type RegisterRequest = Body<'/auth/register', 'post'>;
// // export type RegisterSuccess = Success<'/auth/register', 'post'>;
// // export type RegisterError = ErrorResponse<'/auth/register', 'post'>;

// // export type User = components['schemas']['User'];
// // export type Error = components['schemas']['Error'];

// //======================= Smart way to use it in any services ==================

// // ═══════════════════════════════════════════════════
// // 1️⃣ Content Types
// // ═══════════════════════════════════════════════════

// export type ContentType =
//   | 'application/json'
//   | 'multipart/form-data'
//   | 'application/x-www-form-urlencoded'
//   | 'text/plain';

// // ═══════════════════════════════════════════════════
// // 2️⃣ API Result
// // ═══════════════════════════════════════════════════

// export interface SuccessResult<T> {
//   ok: true;
//   data: T;
//   statusCode: number;
// }

// export interface ErrorResult {
//   ok: false;
//   message: string;
//   statusCode: number;
//   code: string;
// }

// export type ApiResult<T> = SuccessResult<T> | ErrorResult;

// // ═══════════════════════════════════════════════════
// // 3️⃣ Generics
// // ═══════════════════════════════════════════════════

// export type GetBody<
//   T extends keyof paths,
//   M extends keyof paths[T],
//   C extends ContentType = 'application/json',
// > = paths[T][M] extends {
//   requestBody?: { content: infer Content };
// }
//   ? C extends keyof Content
//     ? Content[C] extends { schema: infer S }
//       ? S
//       : never
//     : never
//   : never;

// type SuccessCode = `${2}${number}${number}`;

// export type GetResponse<
//   T extends keyof paths,
//   M extends keyof paths[T],
//   C extends ContentType = 'application/json',
// > = paths[T][M] extends { responses: infer R }
//   ? {
//       [K in keyof R]: K extends SuccessCode
//         ? R[K] extends { content: infer Content }
//           ? C extends keyof Content
//             ? Content[C] extends { schema: infer S }
//               ? S
//               : never
//             : void
//           : void
//         : never;
//     }[keyof R]
//   : never;

// // ═══════════════════════════════════════════════════
// // 4️⃣ Logger Interface
// // ═══════════════════════════════════════════════════

// export interface Logger {
//   info: (msg: object | string) => void;
//   error: (msg: object | string) => void;
//   warn?: (msg: object | string) => void;
// }

// // ═══════════════════════════════════════════════════
// // 5️⃣ Wrap Options
// // ═══════════════════════════════════════════════════

// export interface WrapOptions {
//   serviceName: string;
//   operationName: string;
//   successStatusCode?: number;
//   logger?: Logger;
// }

// // ═══════════════════════════════════════════════════
// // 6️⃣ Wrapper Function
// // ═══════════════════════════════════════════════════

// export function wrapApi<TInput, TOutput, TContext = unknown>(
//   handler: (input: TInput, ctx: TContext) => Promise<TOutput>,
//   options: WrapOptions
// ) {
//   return async (input: TInput, ctx: TContext): Promise<ApiResult<TOutput>> => {
//     const {
//       serviceName,
//       operationName,
//       successStatusCode = 200,
//       logger,
//     } = options;

//     const startTime = Date.now();

//     try {
//       const result = await handler(input, ctx);
//       const duration = Date.now() - startTime;

//       logger?.info({
//         service: serviceName,
//         operation: operationName,
//         status: 'success',
//         durationMs: duration,
//       });

//       return {
//         ok: true,
//         data: result,
//         statusCode: successStatusCode,
//       };
//     } catch (error: unknown) {
//       const duration = Date.now() - startTime;

//       let message = 'Unexpected error occurred';
//       let code = 'INTERNAL_SERVER_ERROR';
//       let statusCode = 500;

//       if (error instanceof AppError) {
//         message = error.message;
//         code = error.code;
//         statusCode = error.statusCode;
//       } else if (error instanceof Error) {
//         message = error.message;
//       } else if (typeof error === 'string') {
//         message = error;
//       }

//       logger?.error({
//         service: serviceName,
//         operation: operationName,
//         status: 'error',
//         message,
//         code,
//         statusCode,
//         durationMs: duration,
//         stack: error instanceof Error ? error.stack : undefined,
//       });

//       return {
//         ok: false,
//         message,
//         statusCode,
//         code,
//       };
//     }
//   };
// }

// // Generic

// /**
//  * Example
//  * when you call
//  * Body<'auth/register','post'>
//  * ------
//  * then typescript goes to 
//  * paths['/auth/register']['post'] requestBody: {
//     content: {
//       'application/json': {email ,password ,name}
//     };
//   };
//   ----------------
//   Result
//   {email:string, password:string, name:string}
//  */
