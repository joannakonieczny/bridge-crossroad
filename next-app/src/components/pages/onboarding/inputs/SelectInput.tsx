import { Select } from "@chakra-ui/react";
import { WithFormControlWrapper } from "./FormControlWrapper";
import type { FormControlWrapperProps } from "./FormControlWrapper";
import type { SelectProps } from "@chakra-ui/react";

type ISelectInputProps = {
  placeholder?: string;
  onSelectProps?: SelectProps;
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
};

function SelectInput(props: ISelectInputProps) {
  return (
    <Select
      placeholder={props.placeholder}
      focusBorderColor="accent.500"
      _focus={{ borderColor: "accent.500" }}
      {...props.onSelectProps}
    >
      {props.options?.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </Select>
  );
}

export type IFormInputProps = ISelectInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(SelectInput);
