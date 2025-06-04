"use client";

import * as React from "react";
import {
  FormControlWrapperProps,
  WithFormControlWrapper,
} from "./FormControlWrapper";
import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  IconButton,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useGetMonths } from "@/util/date";

interface IMonthYearInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function MonthYearInput(props: IMonthYearInputProps) {
  // Używamy useDisclosure zamiast własnego stanu dla modala
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );

  // Pobieramy nazwy miesięcy z hooka tłumaczeń
  const months = useGetMonths();

  const prevYear = () => setCurrentYear(currentYear - 1);
  const nextYear = () => setCurrentYear(currentYear + 1);

  const selectMonthYear = (month: number) => {
    const monthStr = (month + 1).toString().padStart(2, "0");
    // Format: MM-YYYY
    const formatted = `${monthStr}-${currentYear}`;
    props.onChange(formatted);
    onClose(); // Używamy onClose z useDisclosure
  };

  // Parsuj wartość na miesiąc i rok do wyświetlenia
  const displayValue = React.useMemo(() => {
    if (!props.value) return "";

    const [month, year] = props.value.split("-");
    if (!month || !year) return "";

    return `${months[parseInt(month, 10) - 1]} ${year}`;
  }, [props.value, months]);

  return (
    <>
      <InputGroup>
        <Input
          value={displayValue}
          placeholder={props.placeholder}
          readOnly
          onClick={onOpen}
          cursor="pointer"
          focusBorderColor="accent.500"
          _focus={{ borderColor: "accent.500" }}
        />
        <InputRightElement>
          <FiCalendar onClick={onOpen} cursor="pointer" color="gray.500" />
        </InputRightElement>
      </InputGroup>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems="center" justifyContent="space-between">
              <IconButton
                aria-label="Poprzedni rok"
                icon={<FiChevronLeft />}
                onClick={prevYear}
                variant="ghost"
              />
              <Text textAlign="center" fontWeight="bold">
                {currentYear}
              </Text>
              <IconButton
                aria-label="Następny rok"
                icon={<FiChevronRight />}
                onClick={nextYear}
                variant="ghost"
              />
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={3} spacing={2} mb={4}>
              {months.map((month, index) => (
                <Button
                  key={month}
                  onClick={() => selectMonthYear(index)}
                  size="md"
                  variant="outline"
                  _hover={{ bg: "accent.100" }}
                  _active={{ bg: "accent.200" }}
                  isActive={props.value === `${index + 1}-${currentYear}`}
                  bg={
                    props.value === `${index + 1}-${currentYear}`
                      ? "accent.100"
                      : undefined
                  }
                >
                  {month.substring(0, 3)}
                </Button>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export type IFormInputProps = IMonthYearInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(MonthYearInput);
