#include "DHT.h"
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>
#include <ArduinoJson.h>
#include "secrets.h"

#define DHTPIN 2
#define DHTTYPE DHT11   // DHT 11
#define MOISTURE_SENSOR_IN 1

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASSWORD;
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);
const char broker[] = MQTT_URL;
const char user[] = MQTT_USER;
const char password[] = MQTT_PASSWORD;
const char device[] = DEVICE_ID;
int port = MQTT_PORT;
const char topic[]  = "iot";

int moisture_sensorvalue;
int soil_moisture_percentage;
int minimum_soil_moisture = 0;
int maximum_soil_moisture = 760;

int memory_for_JSON = 200;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }
  Serial.println("You're connected to the network");
  Serial.println();

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);
  mqttClient.setId(device);
  mqttClient.setUsernamePassword(user, password);
  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());
    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();
  
  Serial.println(F("Data from Arduino:"));
  dht.begin();
}

void loop() {
  delay(2000);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  //Gets current time in epoch format
  int current_time = WiFi.getTime();

  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute soil moisture percentage from analog input
  moisture_sensorvalue = analogRead(MOISTURE_SENSOR_IN);
  soil_moisture_percentage = map(moisture_sensorvalue, minimum_soil_moisture, maximum_soil_moisture, 0, 100);
  
  //Prints of data for testing purposes
  Serial.print(F("Humidity: "));
  Serial.print(humidity);
  Serial.print(F("%  Temperature: "));
  Serial.print(temperature);
  Serial.print(F("°C "));
  Serial.print(F("Soil moisture percentage: "));
  Serial.print(soil_moisture_percentage);
  Serial.print("% Time: ");
  Serial.println(current_time);

  //Allocate RAM for JSON 
  DynamicJsonDocument doc(memory_for_JSON);

  //Add values to the JSON document
  doc["deviceId"] = device;
  doc["measurementTime"] = current_time;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["soilMoisture"] = soil_moisture_percentage;

  //Prints the pretty JSON to serial
  serializeJsonPretty(doc, Serial);

  //Creates a message to MQTT client with the selected topic, then sends the serialized JSON doc to MQTT
  mqttClient.beginMessage(topic);
  serializeJson(doc, mqttClient);
  mqttClient.endMessage();
  
}
