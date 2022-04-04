import { uniqueId } from "lodash";
import { connect, MqttClient } from "mqtt";
import { config } from "../config";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement } from "../types";

const { mqttUrl, mqttUser, mqttPassword } = config;

export const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
  clientId: uniqueId(),
  clean: false,
  connectTimeout: 30000,
  protocolId: "MQIsdp",
  protocolVersion: 3,
  keepalive: 60,
});

export const mqttHandler = (client: MqttClient, topic: string) => () => {
  client.on("connect", () => {
    client.subscribe(topic, { qos: 0 }, (err) => {
      if (err) {
        console.error(err);
      }
      console.log("MQTT client subscribed to topic", topic);
    });
  });

  client.on("message", async (topic, message) => {
    const logMessage = { msg: message.toString(), topic };
    console.log(JSON.stringify(logMessage));
    const measurement: NewMeasurement = await JSON.parse(message.toString());
    try {
      await createMeasurement(measurement);
    } catch (e) {
      console.error(e);
    }
  });

  client.on("error", (err) => {
    console.log(err);
  });
};
