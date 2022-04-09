export const KPI = (props: { title: string; value: number; unit: string }) => {
  const { title, value, unit } = props;
  return (
    <div className="w-48 border-2 m-5 p-4 bg-white drop-shadow-md rounded-m">
      <div className="text-xs text-bold text-gray-500">
        {title.toUpperCase()}
      </div>
      <div className="text-2xl text-bold text-gray-700">
        {value.toFixed(1)} {unit}
      </div>
    </div>
  );
};
