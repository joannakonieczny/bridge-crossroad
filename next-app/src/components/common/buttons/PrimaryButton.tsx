import { Button, ButtonProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { ElementType } from "react";

export type IPrimaryButtonProps = {
  text: string;
  href?: string;
  as?: ElementType;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  onElementProps?: ButtonProps;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function PrimaryButton({
  text,
  href,
  as,
  onClick,
  type = "button",
  onElementProps = {},
  size = "md",
}: IPrimaryButtonProps) {
  const isLink = Boolean(href);
  const Component = as ?? (isLink ? NextLink : undefined);

  return (
    <Button
      as={Component}
      href={href}
      onClick={onClick}
      type={isLink ? undefined : type}
      colorScheme="accent"
      size={size}
      {...onElementProps}
    >
      {text}
    </Button>
  );
}
