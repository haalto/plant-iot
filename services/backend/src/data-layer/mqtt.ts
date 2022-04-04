import { connect, MqttClient } from "mqtt";
import { config } from "../config";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement } from "../types";

const { mqttUrl, mqttUser, mqttPassword } = config;

export const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
});

export const mqttHandler = (client: MqttClient, topic: string) => () => {
  client.on("connect", () => {
    console.log("MQTT client connected");
  });

  client.on("error", (err) => {
    console.log(err);
  });

  client.on("disconnect", () => {
    console.log("MQTT client disconnected");
  });

  client.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error(err);
    }
    console.log(`Subscribed to ${topic}`);
  });

  client.on("message", (topic, message) => {
    console.log("foo iot");
    const logMessage = { msg: message.toString(), topic };
    console.log(JSON.stringify(logMessage));
    /*     const measurement: NewMeasurement = await JSON.parse(message.toString());
    try {
      await createMeasurement(measurement);
    } catch (e) {
      console.error(e);
    } */
  });
};
