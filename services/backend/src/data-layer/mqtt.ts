import { connect, MqttClient } from "mqtt";
import { config } from "../config";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement } from "../types";

const { mqttUrl, mqttUser, mqttPassword } = config;

export const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
  clientId: "foo",
  clean: false,
});

export const mqttHandler = (client: MqttClient, topic: string) => () => {
  client.on("connect", () => {
    client.subscribe(topic, { qos: 1 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
      console.log(granted.toString());
      console.log(`Subscribed to ${topic} with QoS ${granted[0].qos}`);
    });
  });

  client.on("message", (topic, message, packet) => {
    console.log(packet, packet.payload.toString());
    const logMessage = { msg: message.toString(), topic };
    console.log(JSON.stringify(logMessage));
    /*     const measurement: NewMeasurement = await JSON.parse(message.toString());
    try {
      await createMeasurement(measurement);
    } catch (e) {
      console.error(e);
    } */
  });

  client.on("error", (err) => {
    console.log(err);
  });

  client.on("disconnect", () => {
    console.log("MQTT client disconnected");
  });
};
