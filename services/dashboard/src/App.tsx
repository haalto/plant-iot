import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { DeviceData } from "./components/DeviceData";
import { config } from "./config";
import { Measurement } from "./types";

type Data = {
  [key: string]: Measurement[];
};

function App() {
  const [data, setData] = useState<Data>({});

  const { current: socket } = useRef(
    io(`${config.SERVER_URL}`, {
      autoConnect: false,
    })
  );

  const renderData = () => {
    return Object.keys(data).map((deviceId) => (
      <DeviceData key={deviceId} data={data[deviceId]}></DeviceData>
    ));
  };

  useEffect(() => {
    socket.open();
    socket.on("measurement", (measurement: Measurement) => {
      const deviceId = measurement.deviceId;
      setData((data) => {
        const newData = { ...data };
        if (!newData[deviceId]) {
          newData[deviceId] = [];
        }
        const convertedDate = new Date(
          measurement.measurementTime
        ).toLocaleTimeString();
        newData[deviceId] = [
          ...newData[deviceId].slice(-20),
          { ...measurement, measurementTime: convertedDate },
        ];
        return newData;
      });
    });

    socket.on("error", (error: any) => {
      console.log(error);
    });
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl text-bold text-gray-700 p-6">
        Plant IoT Dashboard
      </h1>
      <div className="flex flex-col justify-center justify-items-center">
        {renderData()}
      </div>
    </div>
  );
}

export default App;
