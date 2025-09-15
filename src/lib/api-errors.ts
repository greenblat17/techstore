import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorResponse(
  error: unknown,
  fallbackMessage: string = "Internal server error"
): NextResponse {
  console.error("API Error:", error);

  // Handle known API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Handle standard errors
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("unauthorized") || error.message.includes("Unauthorized")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    if (error.message.includes("forbidden") || error.message.includes("Forbidden")) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "FORBIDDEN",
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    if (error.message.includes("not found") || error.message.includes("Not found")) {
      return NextResponse.json(
        {
          error: "Resource not found",
          code: "NOT_FOUND",
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    if (error.message.includes("validation") || error.message.includes("Invalid")) {
      return NextResponse.json(
        {
          error: error.message,
          code: "VALIDATION_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Default error response
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" ? error.message : fallbackMessage,
        code: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: fallbackMessage,
      code: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

// Common API errors
export const ApiErrors = {
  Unauthorized: () => new ApiError("Unauthorized", 401, "UNAUTHORIZED"),
  Forbidden: () => new ApiError("Forbidden", 403, "FORBIDDEN"),
  NotFound: (resource: string = "Resource") => 
    new ApiError(`${resource} not found`, 404, "NOT_FOUND"),
  BadRequest: (message: string = "Bad request") => 
    new ApiError(message, 400, "BAD_REQUEST"),
  ValidationError: (message: string) => 
    new ApiError(message, 400, "VALIDATION_ERROR"),
  InternalError: (message: string = "Internal server error") => 
    new ApiError(message, 500, "INTERNAL_ERROR"),
  ServiceUnavailable: () => 
    new ApiError("Service temporarily unavailable", 503, "SERVICE_UNAVAILABLE"),
  TooManyRequests: () => 
    new ApiError("Too many requests", 429, "TOO_MANY_REQUESTS"),
  PaymentRequired: (message: string = "Payment required") => 
    new ApiError(message, 402, "PAYMENT_REQUIRED"),
  Conflict: (message: string = "Resource conflict") => 
    new ApiError(message, 409, "CONFLICT"),
};

// Async API handler wrapper
export function withApiErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
): (...args: T) => Promise<R | NextResponse> {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}