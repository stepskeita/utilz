import createError from "http-errors";
import { Sequelize } from "sequelize";

/**
 * Global error handler middleware
 * Formats errors and sends appropriate responses
 */
export const errorHandler = (err, req, res, next) => {

    console.log(err);
    // Parse Sequelize errors
    if (err.name && (err.name.includes('Sequelize') || err instanceof Sequelize.Error)) {
        return handleSequelizeError(err, req, res);
    }

    // Handle standard errors
    const statusCode = err.status || 500;

    // For 503 errors (service unavailable), return generic message
    if (statusCode === 503) {
        return res.status(503).json({
            success: false,
            message: 'Service temporarily unavailable. Please try again later.',
            error: {
                code: 'SERVICE_UNAVAILABLE',
                status: 503
            }
        });
    }

    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
        error: {
            code: err.code || 'SERVER_ERROR',
            status: statusCode
        }
    };

    // Add stack trace in development environment
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        console.error(err);
    }

    res.status(statusCode).json(errorResponse);
};

/**
 * Handle Sequelize-specific errors
 * Converts database errors to user-friendly messages
 */
const handleSequelizeError = (err, req, res) => {
    let statusCode = 500;
    let message = 'Database error occurred';
    let errorCode = 'DATABASE_ERROR';

    // Validation errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';

        // Format validation errors
        const validationErrors = err.errors.map(error => {
            // Handle different validation error types
            if (error.type === 'unique violation') {
                const value = error.value;
                const field = error.path || error.instance?.constructor?.name || 'field';
                return {
                    field,
                    message: `'${value}' already exists`
                };
            }

            return {
                field: error.path,
                message: error.message,
                value: error.value
            };
        });

        message = validationErrors?.length > 0 ? validationErrors[0]?.message : 'Validation failed';

        return res.status(statusCode).json({
            success: false,
            message,
            error: {
                code: errorCode,
                status: statusCode,
                details: validationErrors
            }
        });
    }

    // Foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'The referenced record does not exist';
        errorCode = 'FOREIGN_KEY_ERROR';
    }

    // Connection errors
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
        statusCode = 503;
        message = 'Database connection error';
        errorCode = 'DATABASE_CONNECTION_ERROR';
    }

    // Timeout errors
    if (err.name === 'SequelizeTimeoutError') {
        statusCode = 503;
        message = 'Database operation timed out';
        errorCode = 'DATABASE_TIMEOUT';
    }

    // Default database error response
    return res.status(statusCode).json({
        success: false,
        message,
        error: {
            code: errorCode,
            status: statusCode,
            // Include original error details in development
            ...(process.env.NODE_ENV === 'development' && {
                originalError: {
                    name: err.name,
                    message: err.message,
                    sql: err.sql,
                    parameters: err.parameters
                }
            })
        }
    });
};

/**
 * 404 Not Found handler middleware
 * Catches requests to undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const notFoundError = createError(404, `Route not found: ${req.method} ${req.originalUrl}`);
    notFoundError.code = 'ROUTE_NOT_FOUND';
    next(notFoundError);
};

export default errorHandler;