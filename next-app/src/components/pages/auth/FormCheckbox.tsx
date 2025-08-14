import type { CheckboxProps } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";

export type IFormCheckboxProps = {
  text: string;
  onElementProps?: CheckboxProps;
};

export default function FormCheckbox(props: IFormCheckboxProps) {
  return (
    <Checkbox {...props.onElementProps} colorScheme="accent" size="md">
      {props.text}
    </Checkbox>
  );
}
