import type { FormControlProps } from "@chakra-ui/react";
import { FormControl, FormErrorMessage, Input, Textarea } from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";
import PasswordInput from "./PasswordInput";

export type IFormInputProps = {
  placeholder: string;
  errorMessage?: string;
  isInvalid?: boolean;
  id?: string;
  isRequired?: boolean;
  type?: "password" | "text" | "email" | "number" | "textarea"; 
  onElementProps?: FormControlProps;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function FormInput(props: IFormInputProps) {
  return (
    <FormControl
      isInvalid={props.isInvalid}
      id={props.id}
      isRequired={props.isRequired}
      {...props.onElementProps}
    >
      {props.errorMessage && (
        <FormErrorMessage mb={2}>{props.errorMessage}</FormErrorMessage>
      )}

      {props.type === "password" ? (
        <PasswordInput
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
        />
      ) : props.type === "textarea" ? (
        <Textarea
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          focusBorderColor="accent.500"
          _focus={{ borderColor: "accent.500" }}
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
