import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import io from "socket.io-client";
import { config } from "./config";

type Measurement = {
  deviceId: string;
  humidity: number;
  measurementTime: Date;
  temperature: number;
  soilMoisture: number;
};

type Data = {
  [key: string]: Measurement[];
};

const KPI = (props: { title: string; value: number }) => {
  const { title, value } = props;
  return (
    <div className="w-48 border-2 m-5 p-4 bg-white drop-shadow-md rounded-m">
      <h3 className="text-xs text-bold text-gray-500">{title.toUpperCase()}</h3>
      <h1 className="text-2xl text-bold text-gray-700">{value.toFixed(1)}</h1>
    </div>
  );
};

const DeviceData = (props: { data: Measurement[] }) => {
  const { data } = props;
  return (
    <>
      <h2>{data[0]?.deviceId}</h2>
      <div>
        <div className="flex row-auto">
          <KPI
            title={"Humidity"}
            value={data.slice(-1)[0]?.humidity ?? 0}
          ></KPI>
          <KPI
            title={"Soil moisture"}
            value={data.slice(-1)[0]?.soilMoisture ?? 0}
          ></KPI>
          <KPI
            title={"Temperature"}
            value={data.slice(-1)[0]?.temperature ?? 0}
          ></KPI>
        </div>
        <LineChart width={700} height={300} data={data}>
          <XAxis dataKey="measurementTime" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line dataKey="humidity" stroke="#8884d8" dot={false} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#82ca9d"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="soilMoisture"
            stroke="#ca82a6"
            dot={false}
          />
        </LineChart>
      </div>
    </>
  );
};

function App() {
  const [data, setData] = useState<Data>({ devices: [] });

  const { current: socket } = useRef(
    io(`${config.SERVER_URL}`, {
      autoConnect: false,
    })
  );

  useEffect(() => {
    socket.open();

    socket.on("measurement", (measurement: Measurement) => {
      const deviceId = measurement.deviceId;
      setData((data) => {
        const newData = { ...data };
        if (!newData[deviceId]) {
          newData[deviceId] = [];
        }
        newData[deviceId] = [...newData[deviceId].slice(-20), measurement];
        return newData;
      });
    });

    socket.on("error", (error: any) => {
      console.log(error);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Plant IoT Dashboard</h1>
      {Object.keys(data).map((deviceId) => (
        <DeviceData key={deviceId} data={data[deviceId]}></DeviceData>
      ))}
    </div>
  );
}

export default App;
