"use client";

import { useState, useMemo, useEffect } from "react";
import type { FormControlWrapperProps } from "../../../common/form/util/FormControlWrapper";
import { WithFormControlWrapper } from "../../../common/form/util/FormControlWrapper";
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
import { UserValidationConstants } from "@/schemas/model/user/user-const";

type IMonthYearInputProps = {
  value: string | Date | null | undefined;
  onChange: (value: Date) => void;
  placeholder: string;
};

function MonthYearInput(props: IMonthYearInputProps) {
  // Używamy useDisclosure zamiast własnego stanu dla modala
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Pobierz bieżącą datę
  const currentDate = new Date();
  const currentMonthNumber = currentDate.getMonth(); // 0-11
  const currentYearNumber = currentDate.getFullYear();

  // Stan dla roku pokazywanego w selektorze
  const [selectedYear, setSelectedYear] = useState(currentYearNumber);

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
    min: UserValidationConstants.yearOfBirth.min,
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
    // Tworzymy obiekt Date z wybranym miesiącem i rokiem, dzień ustawiony na 1
    // Ustawiamy godzinę na 12 w południe, aby uniknąć problemów ze strefą czasową
    const selectedDate = new Date(selectedYear, month, 1, 12, 0, 0, 0);
    props.onChange(selectedDate);
    onClose();
  };

  // Parsuj wartość na miesiąc i rok do wyświetlenia
  const displayValue = useMemo(() => {
    if (!props.value) return "";

    let month: number;
    let year: number;

    if (props.value instanceof Date) {
      month = props.value.getMonth(); // 0-11
      year = props.value.getFullYear();
    } else {
      // Zakładamy format "MM-YYYY"
      const [monthStr, yearStr] = props.value.split("-");
      if (!monthStr || !yearStr) return "";

      month = parseInt(monthStr, 10) - 1; // Konwersja z 1-12 na 0-11
      year = parseInt(yearStr, 10);

      if (isNaN(month) || isNaN(year)) return "";
    }

    return `${months[month]} ${year}`;
  }, [props.value, months]);

  // Konwersja wartości do obiektu Date dla wewnętrznego użytku
  const valueAsDate = useMemo((): Date | null => {
    if (!props.value) return null;

    if (props.value instanceof Date) {
      // Upewniamy się, że dzień jest ustawiony na 1
      const year = props.value.getFullYear();
      const month = props.value.getMonth();
      return new Date(year, month, 1, 12, 0, 0, 0);
    }

    // Zakładamy format "MM-YYYY"
    const [monthStr, yearStr] = props.value.split("-");
    if (!monthStr || !yearStr) return null;

    const month = parseInt(monthStr, 10) - 1; // Konwersja z 1-12 na 0-11
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year)) return null;

    return new Date(year, month, 1, 12, 0, 0, 0);
  }, [props.value]);

  // Aktualizuj rok w useNumberInput gdy otwieramy modal
  useEffect(() => {
    if (isOpen && valueAsDate) {
      setSelectedYear(valueAsDate.getFullYear());
    }
  }, [isOpen, valueAsDate]);

  // Sprawdź czy dana data jest aktualnie wybrana
  const isDateSelected = (year: number, month: number): boolean => {
    if (!valueAsDate) return false;

    return (
      valueAsDate.getFullYear() === year && valueAsDate.getMonth() === month
    );
  };

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
          <FiCalendar onClick={onOpen} cursor="pointer" color="border.500" />
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
                    isActive={isDateSelected(selectedYear, index)}
                    bg={
                      isDateSelected(selectedYear, index)
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
