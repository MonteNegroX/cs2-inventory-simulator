import React, { useEffect, useRef, useState } from "react";
import { CustomItem } from "~/utils/custom-items";
import { rollFromCase } from "~/utils/roll";
import { CUSTOM_CASE } from "~/utils/custom-case";

interface Props {
    onFinish: (item: CustomItem) => void;
}

export default function CustomCaseSpinner({ onFinish }: Props) {
    const [spinningItems, setSpinningItems] = useState<CustomItem[]>([]);
    const [isSpinning, setIsSpinning] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Создаём массив для "рельсы"
        const railItems = [];
        for (let i = 0; i < 50; i++) {
            const randomItem = CUSTOM_CASE.items[Math.floor(Math.random() * CUSTOM_CASE.items.length)];
            railItems.push(randomItem);
        }
        setSpinningItems(railItems);

        // Запускаем анимацию
        const container = containerRef.current;
        if (!container) return;

        container.animate(
            [
                { transform: "translateX(0)" },
                { transform: `translateX(-${container.scrollWidth - container.clientWidth}px)` }
            ],
            {
                duration: 4000,
                easing: "ease-out"
            }
        ).onfinish = () => {
            const dropped = rollFromCase(CUSTOM_CASE);
            setIsSpinning(false);
            onFinish(dropped);
        };
    }, []);

    return (
        <div className="w-full overflow-hidden border rounded bg-stone-800 p-2">
            <div ref={containerRef} className="flex gap-2">
                {spinningItems.map((item, index) => (
                    <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded"
                    />
                ))}
            </div>
        </div>
    );
}
