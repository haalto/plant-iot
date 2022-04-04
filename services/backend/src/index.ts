import { uniqueId } from "lodash";
import { connect } from "mqtt";
import { app } from "./app";
import { config } from "./config";
import { mqttClient, mqttHandler } from "./data-layer/mqtt";
import { createMeasurement } from "./services/measurementServices";
import { NewMeasurement } from "./types";

const { port, host } = config;

(async () => {
  const server = await app({ logger: true });

  const { mqttUrl, mqttUser, mqttPassword } = config;
  const topic = "iot";

  const client = connect(mqttUrl, {
    username: mqttUser,
    password: mqttPassword,
    clientId: uniqueId(),
    clean: true,
    connectTimeout: 30000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    keepalive: 60,
  });

  client.on("connect", () => {
    client.subscribe(topic, { qos: 0 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
      console.log(JSON.stringify(granted));
      console.log(`Subscribed to ${topic}}`);
    });
  });

  client.on("message", async (topic, message, packet) => {
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

  //mqttHandler(mqttClient, "iot")();
  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
