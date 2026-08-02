// Centralized success-response shape so every endpoint returns the same
// { success, message, data, meta } envelope.
class ApiResponse {
    static send(res, { statusCode = 200, message = "Success", data = null, meta = null }) {
        const body = { success: true, message, data };

        if (meta) {
            body.meta = meta;
        }

        return res.status(statusCode).json(body);
    }
}

module.exports = ApiResponse;
