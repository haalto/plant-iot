#include "DHT.h"
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>
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
  
  Serial.println(F("DHTxx test!"));
  dht.begin();
}

void loop() {
  delay(2000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int current_time = WiFi.getTime();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute soil moisture percentage from analog input
  moisture_sensorvalue = analogRead(MOISTURE_SENSOR_IN);
  soil_moisture_percentage = map(moisture_sensorvalue, minimum_soil_moisture, maximum_soil_moisture, 0, 100);
  

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(F("Soil moisture percentage: "));
  Serial.print(soil_moisture_percentage);
  Serial.print("% Time: ");
  Serial.println(current_time);
  
  
}
