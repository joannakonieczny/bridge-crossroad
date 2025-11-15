"use client";

import { HStack, Button, Spacer } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

type Props = {
  prevButton?: {
    text: string;
    onClick?: () => void;
    onElementProps?: ButtonProps;
  };
  nextButton?: {
    text: string;
    onClick?: () => void;
    onElementProps?: ButtonProps;
  };
};

export function SteeringButtons({ prevButton, nextButton }: Props) {
  return (
    <HStack justifyContent="space-between" width="100%" display="flex">
      {prevButton && (
        <Button
          leftIcon={<MdArrowBackIos />}
          variant="outline"
          colorScheme="accent"
          type="button"
          alignSelf="flex-start"
          onClick={prevButton.onClick}
          {...prevButton.onElementProps}
        >
          {prevButton.text}
        </Button>
      )}
      <Spacer />
      {nextButton && (
        <Button
          rightIcon={<MdArrowForwardIos />}
          colorScheme="accent"
          type="button"
          alignSelf="flex-end"
          onClick={nextButton.onClick}
          {...nextButton.onElementProps}
        >
          {nextButton.text}
        </Button>
      )}
    </HStack>
  );
}
