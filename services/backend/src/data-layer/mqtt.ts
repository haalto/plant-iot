import { MqttClient } from "mqtt";
import { createMeasurement } from "../services/measurementServices";
import { NewMeasurement, RawMeasurement } from "../types";
import { Server } from "socket.io";

export const mqttHandler =
  (client: MqttClient, topic: string, socket: Server) => () => {
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

      const measurement: RawMeasurement = await JSON.parse(message.toString());
      const newMeasurement = {
        ...measurement,
        measurementTime: new Date(
          measurement.measurementTime * 1000
        ).toLocaleDateString(),
      };

      socket.emit("measurement", newMeasurement);

      try {
        await createMeasurement(newMeasurement);
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
  };
