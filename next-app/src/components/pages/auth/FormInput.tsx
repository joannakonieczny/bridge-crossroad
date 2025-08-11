import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import PasswordInput from "./PasswordInput";

export interface IFormInputProps {
  placeholder: string;
  errorMessage: string;
  isInvalid?: boolean;
  id?: string;
  isRequired?: boolean;
  type?: "password" | "text" | "email" | "number";
  onElementProps?: FormControlProps;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function FormInput(props: IFormInputProps) {
  return (
    <FormControl
      isInvalid={props.isInvalid}
      id={props.id}
      isRequired={props.isRequired}
      {...props.onElementProps}
    >
      <FormErrorMessage mb={2}>{props.errorMessage}</FormErrorMessage>
      {props.type === "password" ? (
        <PasswordInput
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
      ) : (
        <Input
          placeholder={props.placeholder}
          type={props.type}
          focusBorderColor="accent.500"
          value={props.value}
          onChange={props.onChange}
          _focus={{ borderColor: "accent.500" }}
        />
      )}
    </FormControl>
  );
}
