import { app } from "./app";
import { config } from "./config";
import { mqttClient, mqttHandler } from "./data-layer/mqtt";

const { port, host } = config;

(async () => {
  const server = await app({ logger: true });
  mqttHandler(mqttClient, "iot")();
  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
