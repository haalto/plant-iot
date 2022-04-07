import { connect } from "mqtt";
import { config } from "./config";

const { mqttPassword, mqttUrl, mqttUser } = config;
const topic = "iot";
const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
  clientId: "perse",
  clean: false,
  protocolId: "MQIsdp",
  protocolVersion: 3,
});

(() => {
  mqttClient.on("error", (err) => {
    console.log("MQTT client error", err);
  });

  mqttClient.on("disconnect", () => {
    console.log("MQTT client disconnected");
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

    mqttClient.publish(topic, JSON.stringify(message), {
      qos: 0,
      retain: false,
    });
  }, 1000);
})();
