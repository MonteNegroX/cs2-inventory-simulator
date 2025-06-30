// components/PatternCard.tsx

import React from "react";

export default function PatternCard() {
  const tiles = [];

  // Настройки
  const columns = 20; // ширина по количеству плиток
  const rows = 20; // 20 рядов
  const spacingX = 100; // расстояние по X
  const spacingY = 100; // расстояние по Y
  const scale = 0.4; // размер плитки
  const opacities = [0.05, 0.10, 0.12]; // вариации прозрачности для глубины

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const translateX = x * spacingX - 50; // смещение для центровки
      const translateY = y * spacingY - 50;
      const opacity = opacities[(x + y) % opacities.length]; // плавное чередование
      tiles.push(
        <g
          key={`tile-${x}-${y}`}
          opacity={opacity}
          transform={`translate(${translateX},${translateY}) scale(${scale})`}
        >
          <use xlinkHref="#patternImage" />
        </g>
      );
    }
  }

  return (
    <div className="overflow-hidden w-full h-full">
      <div className="w-full h-full relative">
        {/* Радиальный градиент фона */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, rgb(54, 55, 56) 1%, rgb(14, 15, 15) 80%)",
          }}
        />

        {/* Паттерн поверх */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 2000" // расширенное viewBox для покрытия
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="absolute inset-0"
          >
            <defs>
              {/* Цвет фильтра для паттерна */}
              <filter id="patternColorFilter">
                <feFlood floodColor="#6c6868" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>

              {/* Сам паттерн — иконка */}
              <image
                id="patternImage"
                x="-50"
                y="-50"
                width="100"
                height="100"
                xlinkHref="https://cdn.changes.tg/gifts/patterns/Record%20Player/png/Cash.png"
              />
            </defs>

            <g stroke="none" fill="none" fillRule="evenodd">
              {tiles}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
