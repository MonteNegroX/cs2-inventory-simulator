/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ClientOnly } from "remix-utils/client-only";
import { DEFAULT_APP_FOOTER_NAME } from "~/app-defaults";
import { isOurHostname } from "~/utils/misc";
import { useRules } from "./app-context";
import { Home, Zap, Flame, Rocket, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Footer() {
  const { sourceCommit, appFooterName } = useRules();
  const location = useLocation();
  const menuItems = [
    { to: "/", label: "Main", icon: Home },
    { to: "/weekly", label: "Weekly", icon: Zap },
    { to: "/jackpot", label: "JackPot", icon: Flame },
    { to: "/upgrade", label: "Upgrade", icon: Rocket },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 z-50 flex w-full justify-around bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-2 backdrop-blur-md">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center text-white transition-transform duration-150 ${
              isActive ? "scale-110 opacity-100" : "opacity-70 hover:opacity-90"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </footer>
  );
}
