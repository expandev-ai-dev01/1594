/**
 * @summary
 * Creates a standardized success response
 *
 * @function successResponse
 * @module middleware/crud
 *
 * @param {any} data - Response data
 * @param {any} [metadata] - Optional metadata
 *
 * @returns {object} Standardized success response
 */
export function successResponse(data: any, metadata?: any) {
  return {
    success: true,
    data,
    ...(metadata && { metadata: { ...metadata, timestamp: new Date().toISOString() } }),
  };
}

/**
 * @summary
 * Creates a standardized error response
 *
 * @function errorResponse
 * @module middleware/crud
 *
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 *
 * @returns {object} Standardized error response
 */
export function errorResponse(message: string, code?: string) {
  return {
    success: false,
    error: {
      code: code || 'ERROR',
      message,
    },
    timestamp: new Date().toISOString(),
  };
}
