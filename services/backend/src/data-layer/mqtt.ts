import { MqttClient } from "mqtt";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement } from "../types";

export const mqttHandler = (client: MqttClient, topic: string) => () => {
  client.on("connect", function (connack) {
    console.log(connack);
    client.subscribe(topic, { qos: 0 }, (err) => {
      if (err) {
        console.error(err);
      }
      console.log("MQTT client subscribed to topic", topic);
    });
  });

  client.on("message", async function (topic, message) {
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
