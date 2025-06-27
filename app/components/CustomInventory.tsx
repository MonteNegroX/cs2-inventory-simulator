import React, { useState } from "react";
import { CUSTOM_ITEMS, CustomItem } from "~/utils/custom-items";
import { CUSTOM_CASE } from "~/utils/custom-case";
import { rollFromCase } from "~/utils/roll";
import CustomCaseSpinner from "~/components/CustomCaseSpinner";

export default function CustomInventory() {
    const [spinning, setSpinning] = useState(false);
    const [inventory, setInventory] = useState<CustomItem[]>([]);

    const openCase = () => {
        setSpinning(true);
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-2">🎒 Кастомный инвентарь</h2>

            {!spinning && (
                <button
                    onClick={openCase}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    🎁 Открыть ChatGPT Custom Case
                </button>
            )}

            {spinning && (
                <CustomCaseSpinner
                    onFinish={(droppedItem) => {
                        setInventory(prev => [...prev, droppedItem]);
                        setSpinning(false);
                    }}
                />
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {inventory.map((item, index) => (
                    <div
                        key={index}
                        className="border p-2 rounded shadow bg-stone-700 text-white"
                    >
                        <img src={item.image} alt={item.name} className="w-full rounded" />
                        <div className="mt-2 text-center text-sm font-medium">{item.name}</div>
                        <div className="text-center text-xs text-gray-300">{item.rarity}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
