import { connect, MqttClient } from "mqtt";
const mqttClient = connect("mqtt://localhost:1883");
(() => {
  console.log("Start sending messages");
  setInterval(() => {
    const message = {
      deviceId: "69ced31c-35fb-4b23-afdc-5caf1a00cf81",
      soilMoisture: Math.random() * 100,
      temperature: Math.random() * 100,
      humidity: Math.random() * 100,
      measurementTime: new Date().toISOString(),
    };

    mqttClient.publish("iot", JSON.stringify(message));
  }, 3000);
})();
