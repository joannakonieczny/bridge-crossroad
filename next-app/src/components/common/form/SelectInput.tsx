import {
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
} from "@chakra-ui/react";
import { WithFormControlWrapper } from "./util/FormControlWrapper";
import type { FormControlWrapperProps } from "./util/FormControlWrapper";
import type { SelectProps } from "@chakra-ui/react";

type ISelectInputProps = {
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  onSelectProps?: SelectProps;
};

function SelectInputSolo(props: ISelectInputProps) {
  return (
    <Select
      placeholder={props.placeholder}
      focusBorderColor="accent.500"
      _focus={{ borderColor: "accent.500" }}
      value={props.value}
      disabled={props.isDisabled}
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

function SelectInput(p: ISelectInputProps) {
  if (!p.isLoading) return <SelectInputSolo {...p} />;

  return (
    <InputGroup>
      <SelectInputSolo {...p} isDisabled />
      <InputRightElement pointerEvents="none">
        <Spinner size="sm" color="border.500" />
      </InputRightElement>
    </InputGroup>
  );
}

export type IFormInputProps = ISelectInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(SelectInput);
