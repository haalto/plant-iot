import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });

export const config = {
  mqttUrl: process.env.MQTT_URL || "mqtt://localhost:1883",
  mqttUser: process.env.MQTT_USER || "admin",
  mqttPassword: process.env.MQTT_PASSWORD || "admin",
};
