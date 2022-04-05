import { uniqueId } from "lodash";
import { connect } from "mqtt";
import { app } from "./app";
import { config } from "./config";
import { mqttHandler } from "./data-layer/mqtt";

const { port, host, mqttPassword, mqttUrl, mqttUser } = config;

(async () => {
  const clientId = uniqueId() + "-" + new Date().getTime();
  const client = connect(mqttUrl, {
    username: mqttUser,
    password: mqttPassword,
    clean: true,
    clientId,
    protocolId: "MQIsdp",
    protocolVersion: 3,
    reconnectPeriod: 5000,
    keepalive: 60,
    resubscribe: true,
  });
  const server = await app({ logger: true });
  mqttHandler(client, "iot", server.io)();

  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
