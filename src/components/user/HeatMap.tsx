import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";

const activity = (start, end) => {
  const data = [];
  let currtDate = new Date(start);
  let endDate = new Date(end);

  while (currtDate <= endDate) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currtDate.toISOString().split("T")[0],
      count: count,
    });
    currtDate.setDate(currtDate.getDate() + 1);
  }
  return data;
};

const getColores = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0 , ${greenValue} , 0)`;
  }
  return colors;
};

export default function HeatMaps() {
  const [activityData, setActivityData] = useState([]);
  const [panelColor, setPanelColor] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const startDate = "2025-01-01";
      const endDate = "2025-01-31";
      const data = activity(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count));
      setPanelColor(getColores(maxCount));
    };

    fetchData();
  }, []);
  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
      <h4 className="mb-6 text-xl font-semibold text-[#e6edf3] text-center">
        Recent Contribution
      </h4>
      <div className="flex justify-center ">
        <HeatMap
          className="HeatMap"
          style={{ color: "#7d8590" }}
          value={activityData}
          weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          startDate={new Date("2025-01-01")}
          rectSize={11}
          space={3}
          legendCellSize={0}
          rectProps={{ rx: 2 }}
          panelColors={panelColor}
        />
      </div>
    </div>
  );
}
