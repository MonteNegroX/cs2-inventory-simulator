/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  faArrowDownWideShort,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import {
  INVENTORY_PRIMARY_FILTERS,
  INVENTORY_SECONDARY_FILTERS,
  INVENTORY_SORTERS
} from "~/utils/inventory-filters";
import { useInventoryFilter, useTranslate } from "./app-context";
import { InventoryFilterButton } from "./inventory-filter-button";
import { Select } from "./select";
import { useEffect } from "react"; // ⬅️ уже импортируешь? если нет, добавь

export function InventoryFilter() {
  const translate = useTranslate();
  const {
    handlePrimaryClick,
    handleSecondaryClick,
    primaryIndex,
    search,
    secondaryIndexes,
    setSearch,
    setSorter,
    sorter
  } = useInventoryFilter();

  useEffect(() => {
    const index = INVENTORY_PRIMARY_FILTERS.indexOf("Containers");
    if (index !== -1 && primaryIndex !== index) {
      console.log("⚡ Applying default Main filter on first load:", index);
      handlePrimaryClick(index)();
    }
  }, []); // ⬅️ пустой массив гарантирует вызов один раз при монтировании

  const secondaryFilters =
    INVENTORY_SECONDARY_FILTERS[INVENTORY_PRIMARY_FILTERS[primaryIndex]];
  const hasSecondaryFilters = secondaryFilters !== undefined;

  return <div />;
}
