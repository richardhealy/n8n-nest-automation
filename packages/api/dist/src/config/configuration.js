"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/n8n',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    n8n: {
        webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook',
        apiKey: process.env.N8N_API_KEY || 'default-api-key',
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
});
//# sourceMappingURL=configuration.js.map