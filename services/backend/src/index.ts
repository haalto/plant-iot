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

  mqttHandler(mqttClient, "iot")();
})();
