import { Button, ButtonProps } from "@chakra-ui/react";
import * as React from "react";

export interface IFormMainButtonProps {
  text: string;
  onElementProps?: ButtonProps;
  type?: "submit" | "button" | "reset";
}

export default function FormMainButton(props: IFormMainButtonProps) {
  return (
    <Button
      colorScheme="accent"
      size="lg"
      type={props.type}
      {...props.onElementProps}
    >
      {props.text}
    </Button>
  );
}
