import type { ComponentPropsWithoutRef, CSSProperties } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  readonly variant?: ButtonVariant;
};

// A Record (not a switch) makes TypeScript fail when a new variant has no style.
const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: { background: "#111", color: "#fff" },
  secondary: { background: "#fff", color: "#111" },
};

export const Button = ({ variant = "primary", type = "button", style, ...props }: ButtonProps) => (
  <button
    type={type}
    style={{
      border: "1px solid #111",
      borderRadius: 8,
      padding: "8px 16px",
      cursor: "pointer",
      ...variantStyles[variant],
      ...style,
    }}
    {...props}
  />
);
