export interface AppConfig {
    port: number;
    database: {
        url: string;
    };
    redis: {
        host: string;
        port: number;
    };
    n8n: {
        webhookUrl: string;
        apiKey: string;
    };
    auth: {
        jwtSecret: string;
        expiresIn: string;
    };
}
declare const _default: () => AppConfig;
export default _default;
