import { Checkbox, CheckboxProps } from "@chakra-ui/react";

export interface IFormCheckboxProps {
  text: string;
  onElementProps?: CheckboxProps;
}

export default function FormCheckbox(props: IFormCheckboxProps) {
  return (
    <Checkbox {...props.onElementProps} colorScheme="accent" size="md">
      {props.text}
    </Checkbox>
  );
}
