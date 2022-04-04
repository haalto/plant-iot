import { uniqueId } from "lodash";
import { connect } from "mqtt";
import { app } from "./app";
import { config } from "./config";
//import { mqttHandler } from "./data-layer/mqtt";
import { MqttHandler } from "./data-layer/foo";
const { port, host, mqttPassword, mqttUrl, mqttUser } = config;

(async () => {
  /*   const clientId = uniqueId() + "-" + new Date().getTime();
  console.log(clientId);
  const client = connect(mqttUrl, {
    username: mqttUser,
    password: mqttPassword,
    clean: true,
    protocolId: "MQIsdp",
    protocolVersion: 3,
  });

  mqttHandler(client, "iot")(); */
  const foo = new MqttHandler(mqttUrl, mqttUser, mqttPassword, "iot");
  foo.connect();
  const server = await app({ logger: true });
  server.listen(port, host, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
})();
