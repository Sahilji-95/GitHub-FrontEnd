import { useState, useEffect } from "react";
import HeatMap from "@uiw/react-heat-map";

interface ActivityData {
  date: string;
  count: number;
}

const activity = (start: string, end: string): ActivityData[] => {
  const data: ActivityData[] = [];

  let currDate = new Date(start);
  const endDate = new Date(end);

  while (currDate <= endDate) {
    const count = Math.floor(Math.random() * 50);

    data.push({
      date: currDate.toISOString().split("T")[0],
      count,
    });

    currDate.setDate(currDate.getDate() + 1);
  }

  return data;
};

const getColors = (maxCount: number): Record<number, string> => {
  const colors: Record<number, string> = {};

  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

export default function HeatMaps() {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [panelColor, setPanelColor] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = () => {
      const startDate = "2025-01-01";
      const endDate = "2025-01-31";

      const data = activity(startDate, endDate);

      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count));

      setPanelColor(getColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#161b22] p-6">
      <h4 className="mb-6 text-center text-xl font-semibold text-[#e6edf3]">
        Recent Contribution
      </h4>

      <div className="flex justify-center">
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
