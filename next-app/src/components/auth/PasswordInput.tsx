"use client";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
  useBoolean,
} from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export interface IPasswordInputProps {
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function PasswordInput(props: IPasswordInputProps) {
  const [show, setShow] = useBoolean(true);
  const [isEmpty, setIsEmpty] = useBoolean(true);

  return (
    <InputGroup size="md">
      <Input
        placeholder={props.placeholder}
        type={show ? "password" : "text"}
        focusBorderColor="accent.500"
        value={props.value}
        onChange={(e) => {
          if (e.target.value === "") {
            setIsEmpty.on();
          } else {
            setIsEmpty.off();
          }
          if (props.onChange) props.onChange(e);
        }}
        fontSize={show && !isEmpty ? "3xl" : undefined}
        lineHeight={show ? "short" : undefined}
        _focus={{ borderColor: "accent.500", outline: "none" }}
      />
      <InputRightElement>
        <IconButton
          aria-label={show ? "Ukryj hasło" : "Pokaż hasło"}
          icon={
            <Icon as={show ? MdVisibilityOff : MdVisibility} fontSize={"xl"} />
          }
          onClick={setShow.toggle}
          size="md"
          variant="ghost"
          _hover={{ bg: "none" }}
        />
      </InputRightElement>
    </InputGroup>
  );
}
