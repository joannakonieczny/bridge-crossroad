import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import type { ChangeEvent } from "react";

type SearchInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder,
}: SearchInputProps) {
  return (
    <InputGroup width="100%">
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Szukaj..."}
        pr="2.5rem"
        fontSize="md"
      />
      <InputRightElement pointerEvents="none">
        <FaSearch color="neutral.500" />
      </InputRightElement>
    </InputGroup>
  );
}
