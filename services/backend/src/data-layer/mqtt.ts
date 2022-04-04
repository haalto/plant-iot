import { MqttClient } from "mqtt";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement } from "../types";

export const mqttHandler = (client: MqttClient, topic: string) => () => {
  client.on("connect", function () {
    client.subscribe(topic, { qos: 1 }, (err) => {
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

  client.on("offline", () => {
    console.log("MQTT client offline");
  });

  client.on("close", () => {
    console.log("MQTT client closed");
  });

  client.on("reconnect", () => {
    console.log("MQTT client reconnected");
  });

  client.on("end", () => {
    console.log("MQTT client ended");
  });

  client.on("disconnect", () => {
    console.log("MQTT client disconnected");
  });

  client.on("packetsend", (packet) => {
    console.log("MQTT client packet send", packet);
  });

  client.on("packetreceive", (packet) => {
    console.log("MQTT client packet receive", packet);
  });

  client.on("pingresp", () => {
    console.log("MQTT client pingresp");
  });
};
