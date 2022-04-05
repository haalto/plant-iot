import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || "0.0.0.0",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  mqttUrl: process.env.MQTT_URL || "mqtt://localhost:1883",
  mqttUser: process.env.MQTT_USER || "admin",
  mqttPassword: process.env.MQTT_PASSWORD || "admin",
};
