export type Environment = {
    NODE_ENV: string;

    VITALS_SERVICE_PORT: number;
    VITALS_SERVICE_URL: string;

    KAFKA_BROKER: string;
    KAFKA_GROUP_ID: string;
    KAFKA_TOPIC: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
};

export const getEnv = <K extends keyof Environment>(key: K): Environment[K] => {
    const value = process.env[key] as Environment[K];

    if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}.`);
    }

    return value;
};