"use client";

import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { GrFormAttachment } from "react-icons/gr";
import { BsFillCursorFill } from "react-icons/bs";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useTranslations } from "@/lib/typed-translations";
import MessageBox from "./MessageBox";
import { mockMessages } from "./mock";

type IChatViewProps = {
  groupId: GroupIdType;
};

export default function ChatView(props: IChatViewProps) {
  const t = useTranslations("pages.ChatPage");

  const gap = useBreakpointValue({ base: "1.25rem", md: "3rem" });
  const py = useBreakpointValue({ base: "1rem", md: "2rem" });
  const px = useBreakpointValue({ base: "1rem", md: "3rem" });
  const minH = useBreakpointValue({
    base: "calc(100vh - 7rem)",
    md: "calc(100vh - 5rem)",
  });
  const btnSize = useBreakpointValue({ base: "sm", md: "md" });
  const btnDirection = useBreakpointValue({ base: "column", md: "row" }) as
    | "column"
    | "row";
  const btnWidth = useBreakpointValue({ base: "100%", md: "auto" });

  return (
    <Flex
      backgroundColor="border.50"
      width="100%"
      minHeight={minH}
      paddingY={py}
      paddingX={px}
      gap={gap}
      overflowY="auto"
    >
      <Box
        flex="1"
        backgroundColor="white"
        gap={gap}
        paddingX={px}
        paddingY={py}
        borderRadius="8px"
      >
        <Flex>
          <Stack spacing={4} width="100%">
            {mockMessages.map((msg, index) => (
              <MessageBox
                key={index}
                timestamp={msg.timestamp}
                content={msg.content}
                sender={msg.from}
                isAdmin={msg.isAdmin}
              />
            ))}
          </Stack>
        </Flex>
        <InputGroup alignSelf="center">
          <Input
            focusBorderColor="accent.500"
            placeholder={t("sendMessagePlaceholder")}
          />
          <InputRightElement>
            <ButtonGroup isAttached variant="outline">
              <IconButton
                aria-label="Attach File"
                icon={<GrFormAttachment />}
              />
              <IconButton
                aria-label="Send Message"
                backgroundColor="accent.500"
                icon={<BsFillCursorFill color="white" />}
              />
            </ButtonGroup>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  );
}
