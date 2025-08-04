export default {
    success: (res, data, message = 'Request successful') => {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    },
    error: (res, error, message = 'An error occurred') => {
        return res.status(error.status || 500).json({
            success: false,
            message,
            error: error.message || 'Internal Server Error',
        });
    },
};