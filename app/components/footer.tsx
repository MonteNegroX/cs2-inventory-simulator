import { ClientOnly } from "remix-utils/client-only";
import { DEFAULT_APP_FOOTER_NAME } from "~/app-defaults";
import { isOurHostname } from "~/utils/misc";
import { useRules, useInventoryFilter } from "./app-context";
import { Home, Zap, Flame, Rocket, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { INVENTORY_PRIMARY_FILTERS } from "~/utils/inventory-filters";

export function Footer() {
  const { sourceCommit, appFooterName } = useRules();
  const navigate = useNavigate();
  const location = useLocation();
  const { handlePrimaryClick } = useInventoryFilter();

  const menuItems = [
    { to: "/", label: "КЕЙСЫ", icon: Home },
    { to: "/board", label: "ТОП", icon: Flame },
    { to: "/quest", label: "КВЕСТ", icon: Zap },
    { to: "/profile", label: "ИНВЕНТАРЬ", icon: User },
  ];

  const handleClick = (to: string) => {
    // Проставляем фильтры только для Home и Profile
    if (to === "/") {
      const index = INVENTORY_PRIMARY_FILTERS.indexOf("Containers");
      if (index !== -1) {
        console.log("🏠 Applying Containers filter:", index);
        handlePrimaryClick(index)();
      }
    }
    if (to === "/profile") {
      const index = INVENTORY_PRIMARY_FILTERS.indexOf("GraphicArt");
      if (index !== -1) {
        console.log("👤 Applying GraphicArt filter:", index);
        handlePrimaryClick(index)();
      }
    }
    navigate(to);
  };

  return (
    <footer className="fixed bottom-0 left-0 z-50 flex w-full justify-around bg-gradient-to-r from-blue-500 via-black-500 to-black-500 p-2 backdrop-blur-md">
      <ClientOnly
        fallback={
          <div className="flex w-full justify-around">
            {["", "", "", "", ""].map((_, idx) => (
              <div key={idx} className="h-6 w-6 bg-gray-600 rounded" />
            ))}
          </div>
        }
      >
        {() => (
          <>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;
              return (
                <button
                  key={item.to}
                  onClick={() => handleClick(item.to)}
                  className={`flex flex-col items-center justify-center text-white transition-transform duration-150 ${
                    isActive ? "scale-110 opacity-100" : "opacity-70 hover:opacity-90"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </>
        )}
      </ClientOnly>
    </footer>
  );
}
