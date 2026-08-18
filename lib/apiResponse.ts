import type { NextApiResponse } from 'next'

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: { code: string; message: string }
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export function successResponse<T>(res: NextApiResponse, data: T, status = 200): void {
  res.status(status).json({ success: true, data } satisfies ApiSuccess<T>)
}

export function errorResponse(
  res: NextApiResponse,
  message: string,
  status = 400,
  code = 'ERROR'
): void {
  res.status(status).json({ success: false, error: { code, message } } satisfies ApiError)
}
