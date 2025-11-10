import { Input, Stack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { GrFormAttachment } from "react-icons/gr";
import { BsFillCursorFill } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import { useTranslations } from "@/lib/typed-translations";

export function TextInput() {
  const t = useTranslations("pages.ChatPage");
  return (
    <Stack width="100%" direction="row" spacing="0" padding="0.5rem">
      <Input placeholder={t("sendMessagePlaceholder")} />
      <ButtonGroup isAttached variant="outline">
        <IconButton
          aria-label="Insert Card"
          icon={<TbCards />}
          backgroundColor="border.100"
        />
        <IconButton
          aria-label="Attach File"
          icon={<GrFormAttachment />}
          backgroundColor="border.100"
        />
        <IconButton
          aria-label="Send Message"
          backgroundColor="accent.500"
          icon={<BsFillCursorFill color="bg" />}
        />
      </ButtonGroup>
    </Stack>
  );
}
