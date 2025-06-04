import * as React from "react";
import {
  Heading,
  Text,
  Divider,
  Highlight,
  HighlightProps,
  HeadingProps,
  TextProps,
  DividerProps,
  Flex,
  HStack,
  Button,
  ButtonProps,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export interface IPagesLayoutProps {
  children?: React.ReactNode;
  mainHeading?: {
    text: string;
    highlight?: {
      query: string;
      styles?: HighlightProps["styles"];
    };
    onMainHeadingProps?: HeadingProps;
  };
  subHeading?: {
    text: string;
    onSubHeadingProps?: TextProps;
  };
  prevButton?: {
    onClick?: () => void;
    disabled?: boolean;
    onPrevButtonProps?: ButtonProps;
  };
  nextButton?: {
    onClick?: () => void;
    disabled?: boolean;
    onNextButtonProps?: ButtonProps;
  };
  onDividerProps?: DividerProps;
  onFormProps?: React.HTMLAttributes<HTMLFormElement>;
}

export default function PagesLayout(props: IPagesLayoutProps) {
  const t = useTranslations("OnboardingPage.common");
  return (
    <>
      <Heading
        as="h2"
        size="lg"
        fontWeight="normal"
        textAlign="center"
        {...props.mainHeading?.onMainHeadingProps}
      >
        {props.mainHeading?.highlight?.query ? (
          <Highlight
            query={props.mainHeading.highlight.query}
            styles={{
              color: "orange.400",
              fontWeight: "bold",
              ...props.mainHeading.highlight.styles,
            }}
          >
            {props.mainHeading.text}
          </Highlight>
        ) : (
          props.mainHeading?.text
        )}
      </Heading>
      <Divider
        borderColor="accent.200"
        mt={4}
        mb={1}
        {...props.onDividerProps}
      />
      <Text
        color="accent.400"
        fontWeight="semibold"
        fontSize="md"
        textAlign="center"
        mb={6}
        {...props.subHeading?.onSubHeadingProps}
      >
        {props.subHeading?.text}
      </Text>
      <form style={{ width: "100%" }} {...props.onFormProps}>
        <Flex justifyContent={"center"} width={"100%"} height={"2xs"}>
          {props.children}
        </Flex>
        <HStack spacing={4} justifyContent="center">
          <Button
            leftIcon={<FiChevronLeft />}
            variant="outline"
            colorScheme="accent"
            minW="160px"
            type="submit"
            disabled={props.prevButton?.disabled}
            onClick={props.prevButton?.onClick}
            {...props.prevButton?.onPrevButtonProps}
          >
            {t("prevButton")}
          </Button>

          <Button
            rightIcon={<FiChevronRight />}
            colorScheme="accent"
            minW="160px"
            type="submit"
            disabled={props.nextButton?.disabled}
            onClick={props.nextButton?.onClick}
            {...props.nextButton?.onNextButtonProps}
          >
            {t("nextButton")}
          </Button>
        </HStack>
      </form>
    </>
  );
}
