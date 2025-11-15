import type { InputProps } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import type { FormControlWrapperProps } from "../../../common/form/util/FormControlWrapper";
import { WithFormControlWrapper } from "../../../common/form/util/FormControlWrapper";

type IDefaultInputProps = {
  placeholder?: string;
  onInputProps?: InputProps;
};

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
