import { Measurement } from "../types";
import { KPI } from "./KPI";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const DeviceData = (props: { data: Measurement[] }) => {
  const { data } = props;
  return (
    <div className=" p-3 m-3 bg-white drop-shadow-md rounded-m justify-self-center">
      <h2 className="text-2xl text-bold text-gray-700">{data[0]?.deviceId}</h2>
      <div className="flex justify-around">
        <KPI
          title={"Humidity"}
          value={data.slice(-1)[0]?.humidity ?? 0}
          unit={"%"}
        ></KPI>
        <KPI
          title={"Soil moisture"}
          value={data.slice(-1)[0]?.soilMoisture ?? 0}
          unit={"%"}
        ></KPI>
        <KPI
          title={"Temperature"}
          value={data.slice(-1)[0]?.temperature ?? 0}
          unit={"°C"}
        ></KPI>
      </div>
      <ResponsiveContainer width={"99%"} height={400}>
        <LineChart width={700} height={300} data={data}>
          <XAxis dataKey="measurementTime" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Legend verticalAlign="top" height={36} />

          <Line
            name="Humidity"
            dataKey="humidity"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            name="Temperature"
            type="monotone"
            dataKey="temperature"
            stroke="#82ca9d"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            name="Soil moisture"
            type="monotone"
            dataKey="soilMoisture"
            stroke="#ca82a6"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
