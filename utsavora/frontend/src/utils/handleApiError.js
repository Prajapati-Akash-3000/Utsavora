/**
 * Central utility to parse and format API errors from the backend.
 * Handles standardized DRF errors, network issues, and legacy formats.
 */
export function handleApiError(error) {
  // 1. Network / Server Down / Timeout
  if (!error.response) {
    if (!navigator.onLine) {
      return "You are currently offline. Please check your internet connection.";
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return "Request timed out. The server took too long to respond.";
    }
    return "Unable to connect to the server. Please try again later.";
  }

  const { data, status } = error.response;

  // 2. Standardized Error Format (from backend/utils/exception_handler.py)
  if (data?.error?.message) {
    return data.error.message;
  }

  // 3. Status Code Fallbacks (if backend standardization misses something)
  switch (status) {
    case 400:
      // Try to parse field validation errors if they exist but aren't standardized
      if (typeof data === 'object') {
         const firstKey = Object.keys(data)[0];
         if (firstKey && Array.isArray(data[firstKey])) {
             return data[firstKey][0];
         }
      }
      return "Invalid input data provided.";
    case 401:
      if (data?.detail) return data.detail;
      return "Your session has expired. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 413:
      return "The uploaded file is too large.";
    case 429:
      return "Too many requests. Please slow down.";
    case 500:
    case 502:
    case 503:
    case 504:
      return "An unexpected server error occurred. Our team has been notified.";
    default:
      // 4. Legacy fallbacks
      if (data?.detail) return data.detail;
      if (data?.error) {
          return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      }
      return "Something went wrong. Please try again.";
  }
}
