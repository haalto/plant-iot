import { uniqueId } from "lodash";
import { connect } from "mqtt";
import { app } from "./app";
import { config } from "./config";
import { mqttHandler } from "./data-layer/mqtt";

const { port, host, mqttPassword, mqttUrl, mqttUser } = config;

(async () => {
  const client = connect(mqttUrl, {
    username: mqttUser,
    password: mqttPassword,
    clientId: uniqueId() + "-" + new Date().getTime(),
    clean: true,
    connectTimeout: 30000,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    keepalive: 6,
  });

  mqttHandler(client, "iot")();
  const server = await app({ logger: true });
  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
