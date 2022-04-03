import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || "0.0.0.0",
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres",
  mqttConnectionUrl: process.env.MQTT_HOST || "mqtt://localhost:1883",
};
