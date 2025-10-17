import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export type IFormMainButtonProps = {
  text: string;
  onElementProps?: ButtonProps;
  type?: "submit" | "button" | "reset";
};

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
