import { Button, ButtonProps } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

export interface IFormGoogleButtonProps {
  text: string;
  onElementProps?: ButtonProps;
  type?: "submit" | "button" | "reset";
}

export default function FormGoogleButton(props: IFormGoogleButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      leftIcon={<FcGoogle />}
      type={props.type}
      {...props.onElementProps}
    >
      {props.text}
    </Button>
  );
}
