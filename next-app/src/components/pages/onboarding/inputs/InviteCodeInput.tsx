import type { PinInputProps } from "@chakra-ui/react";
import { HStack, PinInput, PinInputField } from "@chakra-ui/react";
import type { FormControlWrapperProps } from "../../../common/form/util/FormControlWrapper";
import { WithFormControlWrapper } from "../../../common/form/util/FormControlWrapper";

type IInviteCodeInputProps = {
  length: number;
  onPinInputProps?: Omit<PinInputProps, "children">;
};

function InviteCodeInput(props: IInviteCodeInputProps) {
  return (
    <HStack spacing={2} justify="center">
      <PinInput
        type="alphanumeric"
        size="lg"
        otp
        placeholder=""
        {...props.onPinInputProps}
      >
        {Array.from({ length: props.length }).map((_, index) => (
          <PinInputField key={index} />
        ))}
      </PinInput>
    </HStack>
  );
}

export type IFormInputProps = IInviteCodeInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(InviteCodeInput);
