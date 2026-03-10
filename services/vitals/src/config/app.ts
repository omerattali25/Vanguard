import { getEnv } from "src/env";

export type AppConfig = {
    env: {
        type: "production" | "development";
        port: number;
    };
    kafka: {
        groupId: string;
        broker: string;
    };
    db: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
}

const loadConfig = (): AppConfig => {
    const env = getEnv("NODE_ENV") as "production" | "development";
    const port = getEnv("VITALS_SERVICE_PORT");

    return {
        env: {
            type: env as "production" | "development",
            port: port,
        },
        kafka: {
            groupId: getEnv("KAFKA_GROUP_ID"),
            broker: getEnv("KAFKA_BROKER"),
        },
        db: {
            host: getEnv("DB_HOST"),
            port: getEnv("DB_PORT"),
            username: getEnv("DB_USERNAME"),
            password: getEnv("DB_PASSWORD"),
            database: getEnv("DB_NAME"),
        }
    };
};

export default loadConfig;
