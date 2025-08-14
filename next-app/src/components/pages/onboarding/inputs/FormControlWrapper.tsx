import type { PropsWithChildren, ComponentType } from "react";
import type {
  FormControlProps,
  FormErrorMessageProps} from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage
} from "@chakra-ui/react";

export type FormControlWrapperProps = {
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  onElementProps?: FormControlProps;
  onFormErrorMessageProps?: FormErrorMessageProps;
};

export default function FormControlWrapper(
  props: PropsWithChildren<FormControlWrapperProps>
) {
  return (
    <FormControl
      isInvalid={props.isInvalid}
      isRequired={props.isRequired}
      {...props.onElementProps}
    >
      {props.errorMessage && (
        <FormErrorMessage mb={2} {...props.onFormErrorMessageProps}>
          {props.errorMessage}
        </FormErrorMessage>
      )}
      {props.children}
    </FormControl>
  );
}

export function WithFormControlWrapper<T extends FormControlWrapperProps>(
  WrappedComponent: ComponentType<T>
) {
  return function WithFormControl(props: T) {
    const {
      errorMessage,
      isInvalid,
      isRequired,
      onElementProps,
      onFormErrorMessageProps,
      ...restProps
    } = props;

    return (
      <FormControlWrapper
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        isRequired={isRequired}
        onElementProps={onElementProps}
        onFormErrorMessageProps={onFormErrorMessageProps}
      >
        <WrappedComponent {...(restProps as T)} />
      </FormControlWrapper>
    );
  };
}
