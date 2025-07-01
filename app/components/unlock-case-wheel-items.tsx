/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2EconomyItem, CS2UnlockedItem } from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";
import { UnlockCaseWheelItem } from "./unlock-case-wheel-item";

export const UnlockCaseWheelItems = forwardRef(function Items(
  {
    caseItem,
    instant,
    items,
    translateX,
    disableAnimation = false // ✅ добавлено
  }: {
    caseItem: CS2EconomyItem;
    instant?: boolean;
    items: CS2UnlockedItem[];
    translateX: number;
    disableAnimation?: boolean; // ✅ добавлено
  },
  ref: ForwardedRef<Element>
) {
  return (
    <div
      className={clsx(
        "h-[192px] whitespace-nowrap",
        !instant && "[transition:all_6s_cubic-bezier(0,0.11,0.33,1)_0s]"
      )}
      ref={ref as any}
      style={{ transform: `translate(${translateX}px, 0)` }}
    >
      {items.map((item, index) => (
        <UnlockCaseWheelItem
          key={index}
          caseItem={caseItem}
          index={index}
          unlockedItem={item}
          disableAnimation={disableAnimation} // ✅ передаём дальше
        />
      ))}
    </div>
  );
});
