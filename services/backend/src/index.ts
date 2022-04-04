import { connect } from "mqtt";
import { app } from "./app";
import { config } from "./config";
import { mqttClient, mqttHandler } from "./data-layer/mqtt";

const { port, host } = config;

(async () => {
  const server = await app({ logger: true });
  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });

  const { mqttUrl, mqttUser, mqttPassword } = config;
  const topic = "iot";

  const client = connect(mqttUrl, {
    username: mqttUser,
    password: mqttPassword,
    clientId: "foo",
    clean: true,
  });

  client.on("connect", () => {
    client.subscribe(topic, { qos: 1 }, (err, granted) => {
      if (err) {
        console.error(err);
      }
      console.log(JSON.stringify(granted));
      console.log(`Subscribed to ${topic}}`);
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

  client.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  //mqttHandler(mqttClient, "iot")();
})();
