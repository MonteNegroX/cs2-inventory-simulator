import { createContext, useContext, useState } from "react";

export type DateRange = "1d" | "7d" | "30d" | "90d" | "all";

const DateRangeContext = createContext<{
  range: DateRange;
  setRange: (range: DateRange) => void;
}>({
  range: "7d",
  setRange: () => {},
});

export const DateRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [range, setRange] = useState<DateRange>("all"); // ✅ default = "all"
  return (
    <DateRangeContext.Provider value={{ range, setRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};


export const useDateRange = () => useContext(DateRangeContext);
