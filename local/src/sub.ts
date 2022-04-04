import { connect } from "mqtt";
import { config } from "./config";
import { v1 } from "uuid";

const { mqttPassword, mqttUrl, mqttUser } = config;
const topic = "iot-test";

const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
  clientId: "moro",
  clean: true,
});

mqttClient.on("connect", function () {
  mqttClient.subscribe(topic, { qos: 0 }, (err) => {
    if (err) {
      console.error(err);
    }
    console.log("MQTT client subscribed to topic", topic);
  });
});

mqttClient.on("message", function (topic, message) {
  const logMessage = { msg: message.toString(), topic };
  console.log(JSON.stringify(logMessage));
});

(() => {
  mqttClient.on("error", (err) => {
    console.log("MQTT client error", err);
  });

  mqttClient.on("disconnect", () => {
    console.log("MQTT client disconnected");
  });
})();
