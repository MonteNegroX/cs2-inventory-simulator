import { subDays, startOfToday } from "date-fns";
import { DateRange } from "~/contexts/DateRangeContext";

export function getDateFromRange(range: DateRange): string | null {
  const now = new Date();

  switch (range) {
    case "1d":
      return startOfToday().toISOString();
    case "7d":
      return subDays(now, 7).toISOString();
    case "30d":
      return subDays(now, 30).toISOString();
    case "90d":
      return subDays(now, 90).toISOString();
    case "all":
    default:
      return null; // не фильтруем по дате
  }
}