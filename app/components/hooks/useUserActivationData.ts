import { useEffect, useState } from "react";
import { supabase } from "~/db/supabase";
import { getDateFromRange } from "~/utils/getDateFromRange";
import { useDateRange } from "~/contexts/DateRangeContext";

export function useUserActivationData() {
  const { range } = useDateRange();
  const fromDate = getDateFromRange(range);

  const [data, setData] = useState({
    newUsers: 0,
    activatedUsers: 0,
    d1Retention: 0,
    d7Retention: 0,
    d30Retention: 0,
  });

  useEffect(() => {
    async function fetchData() {
      console.log("📅 range:", range);
      console.log("📅 fromDate:", fromDate);

      // 1. Новые пользователи
      let newUsersCount = 0;
      let query = supabase.from("players").select("*", { count: "exact", head: true });
      if (fromDate) {
        query = query.gte("created_at", fromDate);
      }
      const { count: newUsers } = await query;
      newUsersCount = newUsers ?? 0;

      // 2. Активированные — по кейсам
      let caseQuery = supabase.from("case_openings").select("user_id", { count: "exact" });
      if (fromDate) {
        caseQuery = caseQuery.gte("opened_at", fromDate);
      }
      const { data: activatedUserRows } = await caseQuery;
      const activatedUserIds = [...new Set((activatedUserRows ?? []).map(row => row.user_id))];

      // 3. Retention (TODO)
      const d1Retention = 0;
      const d7Retention = 0;
      const d30Retention = 0;

      setData({
        newUsers: newUsersCount,
        activatedUsers: activatedUserIds.length,
        d1Retention,
        d7Retention,
        d30Retention,
      });
    }

    fetchData();
  }, [range]);

  return data;
}
