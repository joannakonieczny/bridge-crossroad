import type {
  FormControlProps,
  InputProps,
  TextareaProps,
} from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
} from "@chakra-ui/react";
import type { ChangeEventHandler } from "react";
import PasswordInput from "./PasswordInput";

type CommonProps = {
  placeholder: string;
  errorMessage?: string;
  isInvalid?: boolean;
  id?: string;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
};

type TextareaInputProps = CommonProps & {
  type: "textarea";
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  inputProps?: TextareaProps & React.RefAttributes<HTMLTextAreaElement>;
};

type StandardInputProps = CommonProps & {
  type?: "password" | "text" | "email" | "number" | "datetime";
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  inputProps?: InputProps & React.RefAttributes<HTMLInputElement>;
};

export type IFormInputProps = TextareaInputProps | StandardInputProps;

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
          value={props.value ?? ""}
          onChange={props.onChange}
        />
      ) : props.type === "textarea" ? (
        <Textarea
          placeholder={props.placeholder}
          value={props.value ?? ""}
          onChange={props.onChange}
          focusBorderColor="accent.500"
          _focus={{ borderColor: "accent.500" }}
          {...props.inputProps}
        />
      ) : props.type === "datetime" ? (
        <Input
          placeholder={props.placeholder}
          type="datetime-local"
          focusBorderColor="accent.500"
          value={props.value ?? ""}
          onChange={props.onChange}
          _focus={{ borderColor: "accent.500" }}
          {...props.inputProps}
        />
      ) : (
        <Input
          placeholder={props.placeholder}
          type={props.type}
          focusBorderColor="accent.500"
          value={props.value ?? ""}
          onChange={props.onChange}
          _focus={{ borderColor: "accent.500" }}
          {...props.inputProps}
        />
      )}
    </FormControl>
  );
}
