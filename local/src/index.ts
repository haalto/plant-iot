import { connect } from "mqtt";
import { config } from "./config";
import { v1 } from "uuid";

const { mqttPassword, mqttUrl, mqttUser } = config;

const mqttClient = connect(mqttUrl, {
  username: mqttUser,
  password: mqttPassword,
  clientId: v1(),
  clean: true,
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

  const message = {
    deviceId: "69ced31c-35fb-4b23-afdc-5caf1a00cf81",
    soilMoisture: Math.random() * 100,
    temperature: Math.random() * 100,
    humidity: Math.random() * 100,
    measurementTime: new Date().toISOString(),
  };

  mqttClient.publish("iot", JSON.stringify(message), {
    qos: 1,
    retain: true,
    properties: {
      messageExpiryInterval: 1000,
    },
  });
  mqttClient.end();
})();
