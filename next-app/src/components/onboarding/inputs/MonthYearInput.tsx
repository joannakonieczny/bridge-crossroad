"use client";

import * as React from "react";
import {
  FormControlWrapperProps,
  WithFormControlWrapper,
} from "./FormControlWrapper";
import {
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  IconButton,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Button,
  useDisclosure,
  HStack,
  useNumberInput,
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

  // Pobierz bieżącą datę
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth(); // 0-11
  const currentYearNumber = currentDate.getFullYear();

  // Stan dla roku pokazywanego w selektorze
  const [selectedYear, setSelectedYear] = React.useState(currentYearNumber);

  // Pobieramy nazwy miesięcy z hooka tłumaczeń
  const months = useGetMonths();

  // Hook do obsługi input numbera dla roku
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    value: yearInputValue,
  } = useNumberInput({
    step: 1,
    defaultValue: selectedYear,
    min: 1900, // Sensowny minimalny rok
    max: currentYearNumber, // Maksymalny rok to obecny rok
    precision: 0, // Tylko liczby całkowite
    onChange: (valueAsString) => {
      const year = parseInt(valueAsString, 10);
      if (!isNaN(year) && year <= currentYearNumber) {
        setSelectedYear(year);
      }
    },
  });

  // Przyciski inkrementacji/dekrementacji roku
  const incYear = getIncrementButtonProps();
  const decYear = getDecrementButtonProps();
  const yearInput = getInputProps();

  // Sprawdza czy dany miesiąc jest w przyszłości
  const isMonthInFuture = (monthIndex: number) => {
    // Jeśli wybrany rok jest bieżącym rokiem
    if (selectedYear === currentYearNumber) {
      // Miesiąc jest w przyszłości, jeśli jego indeks jest większy niż bieżący miesiąc
      return monthIndex > currentMonthNumber;
    }
    // Jeśli rok jest przyszły, wszystkie miesiące są w przyszłości
    return selectedYear > currentYearNumber;
  };

  const selectMonthYear = (month: number) => {
    const monthStr = (month + 1).toString().padStart(2, "0");
    // Format: MM-YYYY
    const formatted = `${monthStr}-${selectedYear}`;
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

  // Aktualizuj rok w useNumberInput gdy otwieramy modal
  React.useEffect(() => {
    if (isOpen && props.value) {
      const [, year] = props.value.split("-");
      if (year) {
        const parsedYear = parseInt(year, 10);
        if (!isNaN(parsedYear)) {
          setSelectedYear(parsedYear);
        }
      }
    }
  }, [isOpen, props.value]);

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
          <ModalHeader px={4} pb={2}>
            <HStack spacing={2} justifyContent="center" mb={2}>
              <IconButton
                aria-label="Zmniejsz rok"
                icon={<FiChevronLeft />}
                {...decYear}
                variant="outline"
              />
              <Input
                {...yearInput}
                width="100px"
                textAlign="center"
                fontWeight="bold"
              />
              <IconButton
                aria-label="Zwiększ rok"
                icon={<FiChevronRight />}
                {...incYear}
                variant="outline"
                // Ograniczymy do bieżącego roku
                isDisabled={parseInt(yearInputValue, 10) >= currentYearNumber}
              />
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={3} spacing={2} mb={4}>
              {months.map((month, index) => {
                // Sprawdź czy miesiąc jest w przyszłości
                const isFutureMonth = isMonthInFuture(index);

                return (
                  <Button
                    key={month}
                    onClick={() => selectMonthYear(index)}
                    size="md"
                    variant="outline"
                    _hover={{ bg: "accent.100" }}
                    _active={{ bg: "accent.200" }}
                    isActive={
                      props.value ===
                      `${(index + 1)
                        .toString()
                        .padStart(2, "0")}-${selectedYear}`
                    }
                    bg={
                      props.value ===
                      `${(index + 1)
                        .toString()
                        .padStart(2, "0")}-${selectedYear}`
                        ? "accent.100"
                        : undefined
                    }
                    // Wyłącz przyciski dla miesięcy w przyszłości
                    isDisabled={isFutureMonth}
                    // Przyciemnij przyciski dla przyszłych miesięcy
                    opacity={isFutureMonth ? 0.5 : 1}
                  >
                    {month.substring(0, 3)}
                  </Button>
                );
              })}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export type IFormInputProps = IMonthYearInputProps & FormControlWrapperProps;
export default WithFormControlWrapper<IFormInputProps>(MonthYearInput);
