import { components, paths } from './api-schema.js';

export type Body<
  T extends keyof paths,
  M extends 'post' | 'get' | 'put' | 'delete' | 'patch',
> = paths[T][M] extends {
  requestBody: {
    content: {
      'application/json': infer R;
    };
  };
}
  ? R
  : never;

export type Success<
  T extends keyof paths,
  M extends keyof paths[T],
> = paths[T][M] extends {
  responses: {
    201: {
      content: {
        'application/json': infer R;
      };
    };
  };
}
  ? R
  : paths[T][M] extends {
        responses: {
          200: {
            content: {
              'application/json': infer R;
            };
          };
        };
      }
    ? R
    : never;

export type ErrorResponse<
  T extends keyof paths,
  M extends keyof paths[T],
> = paths[T][M] extends {
  responses: {
    400: {
      content: {
        'application/json': infer R;
      };
    };
  };
}
  ? R
  : never;

export type RegisterRequest = Body<'/auth/register', 'post'>;
export type RegisterSuccess = Success<'/auth/register', 'post'>;
export type RegisterError = ErrorResponse<'/auth/register', 'post'>;

export type User = components['schemas']['User'];
export type Error = components['schemas']['Error'];

/**
 * Example
 * when you call
 * Body<'auth/register','post'>
 * ------
 * then typescript goes to 
 * paths['/auth/register']['post'] requestBody: {
    content: {
      'application/json': {email ,password ,name}
    };
  };
  ----------------
  Result
  {email:string, password:string, name:string}
 */
