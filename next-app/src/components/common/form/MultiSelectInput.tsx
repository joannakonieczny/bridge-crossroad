import {
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { WithFormControlWrapper } from "./util/FormControlWrapper";
import type { FormControlWrapperProps } from "./util/FormControlWrapper";
import type { SelectProps } from "@chakra-ui/react";
import { useState } from "react";
import SelectInput from "./SelectInput";

type IMultiSelectInputProps = {
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value?: string[];
  isLoading?: boolean;
  isDisabled?: boolean;
  onChange?: (values: string[]) => void;
  onSelectProps?: Omit<SelectProps, "onChange" | "value">;
};

function MultiSelectInputSolo(props: IMultiSelectInputProps) {
  const [tempValue, setTempValue] = useState<string>("");
  const selectedValues = props.value || [];

  const availableOptions =
    props.options?.filter((option) => !selectedValues.includes(option.value)) ||
    [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue && !selectedValues.includes(newValue)) {
      props.onChange?.([...selectedValues, newValue]);
      setTempValue("");
    }
  };

  const handleRemove = (valueToRemove: string) => {
    props.onChange?.(selectedValues.filter((v) => v !== valueToRemove));
  };

  const getOptionLabel = (value: string) => {
    return props.options?.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <VStack align="stretch" spacing={2} w="100%">
      <SelectInput
        placeholder={props.placeholder}
        options={availableOptions}
        value={tempValue}
        isDisabled={props.isDisabled || availableOptions.length === 0}
        onChange={handleSelectChange}
        isLoading={props.isLoading}
        onSelectProps={props.onSelectProps}
      />
      {selectedValues.length > 0 && (
        <Wrap spacing={2}>
          {selectedValues.map((value) => (
            <WrapItem key={value}>
              <Tag
                size="md"
                colorScheme="accent"
                borderRadius="md"
                variant="solid"
              >
                <TagLabel>{getOptionLabel(value)}</TagLabel>
                <TagCloseButton
                  onClick={() => handleRemove(value)}
                  isDisabled={props.isDisabled}
                />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </VStack>
  );
}

function MultiSelectInput(p: IMultiSelectInputProps) {
  return <MultiSelectInputSolo {...p} />;
}

export type IFormMultiSelectInputProps = IMultiSelectInputProps &
  FormControlWrapperProps;
export default WithFormControlWrapper<IFormMultiSelectInputProps>(
  MultiSelectInput
);
