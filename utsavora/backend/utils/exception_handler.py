import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from django.db import IntegrityError

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Global exception handler for Utsavora API.
    Standardizes all errors into:
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message": "Human readable message",
        "details": { ... }
      }
    }
    """
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # 1. Handle native Django ValidationError which DRF might miss
    if isinstance(exc, DjangoValidationError):
        exc = DRFValidationError(detail=exc.message_dict if hasattr(exc, 'message_dict') else {'error': exc.messages})
        response = exception_handler(exc, context)
        
    # 2. Handle DB Integrity Errors (e.g., unique constraints)
    if isinstance(exc, IntegrityError):
        logger.error(f"Integrity Error: {str(exc)}", exc_info=True)
        return Response({
            "success": False,
            "error": {
                "code": "INTEGRITY_ERROR",
                "message": "A database conflict occurred.",
                "details": str(exc) if 'utsavora' not in str(exc) else "Record already exists."
            }
        }, status=400)

    # 3. Unhandled exceptions (500s)
    if response is None:
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return Response({
            "success": False,
            "error": {
                "code": "SERVER_ERROR",
                "message": "An unexpected server error occurred. Please try again later.",
                "details": str(exc)  # Might want to hide this in strong production, but good for now
            }
        }, status=500)

    # 4. Standardize format for DRF responses
    code = "API_ERROR"
    message = "An error occurred."
    details = response.data

    if response.status_code == 400:
        code = "VALIDATION_ERROR"
        message = "Invalid input data."
        # If it's a simple string detail, promote it to message
        if isinstance(details, dict) and 'detail' in details:
            message = details.pop('detail')
        elif isinstance(details, list) and len(details) > 0 and isinstance(details[0], str):
            message = details[0]
            
    elif response.status_code == 401:
        code = "UNAUTHENTICATED"
        message = "Your session has expired or is invalid. Please log in again."
        if isinstance(details, dict) and 'detail' in details:
            details.pop('detail')
            
    elif response.status_code == 403:
        code = "PERMISSION_DENIED"
        message = "You do not have permission to perform this action."
        if isinstance(details, dict) and 'detail' in details:
            details.pop('detail')
            
    elif response.status_code == 404:
        code = "NOT_FOUND"
        message = "The requested resource was not found."
        
    elif response.status_code == 429:
        code = "THROTTLED"
        message = "Too many requests. Please slow down."
        
    # Extra cleanup: If message is generic, and there's a specific 'error' or 'detail' key, use it
    if isinstance(details, dict):
        if 'error' in details and isinstance(details['error'], str):
            message = details.pop('error')
        if 'detail' in details and isinstance(details['detail'], str):
             message = details.pop('detail')

    return Response({
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details if details else None
        }
    }, status=response.status_code)
