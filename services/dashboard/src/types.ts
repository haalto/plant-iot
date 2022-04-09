export type Measurement = {
  deviceId: string;
  humidity: number;
  measurementTime: Date | string;
  temperature: number;
  soilMoisture: number;
};
