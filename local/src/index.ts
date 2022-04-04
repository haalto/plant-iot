import { connect } from "mqtt";
import { config } from "./config";

const { mqttPassword, mqttUrl, mqttUser } = config;

const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
});

(() => {
  mqttClient.on("connect", () => {
    console.log("MQTT client connected");
  });

  mqttClient.on("error", (err) => {
    console.log("MQTT client error", err);
  });

  mqttClient.on("disconnect", () => {
    console.log("MQTT client disconnected");
  });

  mqttClient.subscribe("iot", { qos: 1 });

  mqttClient.on("message", (topic, message) => {
    const logMessage = { msg: message.toString(), topic };
    console.log(JSON.stringify(logMessage));
  });

  console.log("Start sending messages");
  setInterval(() => {
    const message = {
      deviceId: "69ced31c-35fb-4b23-afdc-5caf1a00cf81",
      soilMoisture: Math.random() * 100,
      temperature: Math.random() * 100,
      humidity: Math.random() * 100,
      measurementTime: new Date().toISOString(),
    };

    mqttClient.publish("iot", JSON.stringify(message), {
      qos: 2,
      retain: true,
    });
  }, 3000);
})();
