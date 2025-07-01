import { useEffect, useState } from "react";
import { range } from "~/utils/number";

export function InventoryGridPlaceholder() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCount(6); // lg экраны
      } else {
        setCount(0); // мобильные
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return range(count).map((index) => (
    <div className="w-[154px]" key={index} />
  ));
}
