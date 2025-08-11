import { Checkbox, CheckboxProps, Text, HStack } from "@chakra-ui/react";
import {
  FormControlWrapperProps,
  WithFormControlWrapper,
} from "./FormControlWrapper";
import { ReactNode } from "react";
import ChakraLink from "@/components/chakra-config/ChakraLink";

interface LinkInfo {
  text: string;
  href: string;
}

interface ICheckBoxInputProps {
  label?: string | ReactNode;
  isChecked?: boolean;
  onChange?: (checked: boolean) => void;
  linkInfo?: LinkInfo;
  onCheckBoxProps?: CheckboxProps;
}

function CheckBoxInput(props: ICheckBoxInputProps) {
  return (
    <Checkbox
      colorScheme="accent"
      isChecked={props.isChecked}
      onChange={(e) => props.onChange?.(e.target.checked)}
      {...props.onCheckBoxProps}
    >
      {props.linkInfo ? (
        <HStack spacing={1} alignItems="center">
          <Text fontSize="sm">
            {props.label}{" "}
            <ChakraLink
              href={props.linkInfo.href}
              color="accent.500"
              textDecoration="underline"
            >
              {props.linkInfo.text}
            </ChakraLink>
          </Text>
        </HStack>
      ) : (
        <Text fontSize="sm">{props.label}</Text>
      )}
    </Checkbox>
  );
}

export type IFormCheckboxProps = ICheckBoxInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormCheckboxProps>(CheckBoxInput);
