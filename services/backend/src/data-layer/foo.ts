import { MqttClient } from "mqtt";
import mqtt = require("mqtt");
import { createMeasurement } from "src/services/measurementServices";
import { NewMeasurement } from "src/types";

export class MqttHandler {
  mqttClient: MqttClient | null;
  host: string;
  username: string;
  password: string;
  topic: string;

  constructor(host: string, username: string, password: string, topic: string) {
    this.mqttClient = null;
    this.host = host;
    this.username = username; // mqtt credentials if these are needed to connect
    this.password = password;
    this.topic = topic;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      // @ts-ignore
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", (connack) => {
      console.log(connack);
      // @ts-ignore
      this.mqttClient.subscribe(this.topic, { qos: 0 }, (err) => {
        if (err) {
          console.error(err);
        }
        console.log("MQTT client subscribed to topic", this.topic);
      });
    });

    this.mqttClient.on("message", async function (topic, message) {
      const logMessage = { msg: message.toString(), topic };
      console.log(JSON.stringify(logMessage));
      const measurement: NewMeasurement = await JSON.parse(message.toString());
      try {
        await createMeasurement(measurement);
      } catch (e) {
        console.error(e);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }
}
