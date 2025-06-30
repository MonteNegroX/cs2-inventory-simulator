import React from "react";

const PatternSVGBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full z-0">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 416 416"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="absolute inset-0"
            >
                <defs>
                    <filter id="patternColorFilter">
                        <feFlood floodColor="#6c6868" />
                        <feComposite in2="SourceGraphic" operator="in" />
                    </filter>

                    <image
                        id="patternImage"
                        x="-50"
                        y="-50"
                        width="100"
                        height="100"
                        xlinkHref="https://cdn.changes.tg/gifts/patterns/Diamond%20Ring/png/Ace%20Of%20Hearts.png"
                    />

                    <g id="fullPattern">
                        {/* Расставляем плитки с разным scale и opacity */}
                        <g opacity="0.10" transform="translate(106, 29) scale(0.33)">
                            <use xlinkHref="#patternImage" />
                        </g>
                        <g opacity="0.10" transform="translate(310, 29) scale(0.33)">
                            <use xlinkHref="#patternImage" />
                        </g>
                        <g opacity="0.15" transform="translate(208, 37) scale(0.33)">
                            <use xlinkHref="#patternImage" />
                        </g>
                        <g opacity="0.24" transform="translate(141, 81) scale(0.41)">
                            <use xlinkHref="#patternImage" />
                        </g>
                        {/* Добавь больше по вкусу для плотности */}
                    </g>
                </defs>

                <g stroke="none" fill="none" fillRule="evenodd">
                    <use xlinkHref="#fullPattern" filter="url(#patternColorFilter)" />
                </g>
            </svg>
        </div>
    );
};

export default PatternSVGBackground;
