import React from "react";
import logoImg from "@/assets/logo.png";
import logoDarkImg from "@/assets/logo.png"; // same for now

interface BnbCircleLogoProps {
  variant?: "full" | "icon";
  color?: "default" | "white" | "dark";
  size?: number;
  className?: string;
}

/**
 * Uses the real BnbCircle logo image.
 * On dark backgrounds use color="white" (applies brightness filter).
 */
export function BnbCircleLogo({
  variant = "full",
  color = "default",
  size = 32,
  className,
}: BnbCircleLogoProps) {
  const style: React.CSSProperties = {
    height: size,
    width: "auto",
    objectFit: "contain" as const,
    maxWidth: 160,
    filter:
      color === "white"
        ? "brightness(0) invert(1)"
        : color === "dark"
        ? "brightness(0)"
        : undefined,
  };

  return (
    <img
      src={logoImg}
      alt="Bnb Circle"
      style={style}
      className={className}
      draggable={false}
    />
  );
}

export default BnbCircleLogo;
