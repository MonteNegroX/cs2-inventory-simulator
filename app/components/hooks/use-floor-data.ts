import { useEffect, useState } from "react";

interface FloorData {
  time: string;
  floor: string;
  url: string;
  collectionId: string;
  floorTon: string;
}

export function useFloorData() {
  const [freshFloorData, setFreshFloorData] = useState<FloorData | null>(null);

  useEffect(() => {
  const fetchFloorData = async () => {
    try {
      const res = await fetch("/floors-ton.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      console.log("✅ Загружены данные floors-ton.json:", data); // <<< добавь
      setFreshFloorData(data);
    } catch (error) {
      console.error("Failed to load floors-ton.json", error);
    }
  };

  fetchFloorData();
  const interval = setInterval(fetchFloorData, 30000);
  return () => clearInterval(interval);
}, []);

  return { freshFloorData };
}
