import React from 'react';

import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';

interface LiquidGlassProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    intensity?: number;
    duration?: string;
    blur?: number;
    opacity?: number;
    borderRadius?: string;
}

export const LiquidGlass = ({
    children,
    className = "",
    style = {},
    blur = 0.02,
    opacity = 0.08,
    ...props
}: LiquidGlassProps) => {
    const filterId = `liquid-glass-${Math.random().toString(36).substr(2, 9)}`;

    const glassStyle = {
        // position: "fixed",
        width: "10rem",
        height: "10rem",
        borderRadius: "50%",
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `url(#${filterId})`,
        WebkitBackdropFilter: `url(#${filterId})`,
        ...style
    };

    return (
        <>
            {/* SVG Filter Definition */}
            <svg style={{ width: 0, height: 0 }}>
                <filter id={filterId} primitiveUnits="objectBoundingBox">
                    <feImage href="/download.png" x="0" y="0" width="1" height="1" result="map" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
                    <feDisplacementMap
                        id="disp"
                        in="blur"
                        in2="map"
                        scale="1"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    >
                    </feDisplacementMap>
                </filter>
            </svg>

            <div
                id={filterId}
                className={`liquid-glass ${className}`}
                style={glassStyle as React.CSSProperties}
                {...props}
            >
                {children}
            </div>
        </>
    );
};