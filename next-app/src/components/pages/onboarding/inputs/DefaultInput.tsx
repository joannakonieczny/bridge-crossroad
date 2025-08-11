import { Input, InputProps } from "@chakra-ui/react";
import {
  FormControlWrapperProps,
  WithFormControlWrapper,
} from "./FormControlWrapper";

type IDefaultInputProps = {
  placeholder?: string;
  onInputProps?: InputProps;
}

function DefaultInput(props: IDefaultInputProps) {
  return (
    <Input
      placeholder={props.placeholder}
      focusBorderColor="accent.500"
      _focus={{ borderColor: "accent.500" }}
      {...props.onInputProps}
    />
  );
}

export type IFormInputProps = IDefaultInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(DefaultInput);
