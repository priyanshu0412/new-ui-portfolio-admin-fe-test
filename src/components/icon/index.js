"use client";
import React from "react";
import { Icon as Ic } from "@iconify/react";

// -----------------------------------------

const Icon = ({
    className,
    height,
    width,
    rotate,
    color,
    style,
    icon,
    onClick,
    ...props
}) => {
    return (
        <div className={className} style={{ overflow: "none" }} onClick={onClick}>
            <Ic
                {...props}
                icon={icon}
                height={height}
                width={width}
                rotate={rotate}
                color={color}
                className={`h-auto ${color}`}
                style={style}
            />
        </div>
    );
};

export default Icon;
