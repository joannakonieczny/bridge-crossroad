"use client";

import { Input, Stack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { GrFormAttachment } from "react-icons/gr";
import { BsFillCursorFill } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import { useTranslations } from "@/lib/typed-translations";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionMutation } from "@/lib/tanstack-action/actions-mutation";
import { postNewMessage } from "@/services/chat/api";
import { addModifyChatMessageSchema } from "@/schemas/pages/with-onboarding/chat/chat-schema";
import type { GroupIdType } from "@/schemas/model/group/group-types";
import { useQueryClient } from "@tanstack/react-query";

type TextInputProps = {
  groupId: GroupIdType;
};

export function TextInput({ groupId }: TextInputProps) {
  const t = useTranslations("pages.ChatPage");
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(addModifyChatMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const sendMessageMutation = useActionMutation({
    action: (data: { message: string }) =>
      postNewMessage({ groupId, message: data.message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", groupId] });
      reset();
    },
  });

  const onSubmit = (data: { message: string }) => {
    if (!data.message.trim()) return;
    sendMessageMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack width="100%" direction="row" spacing="0" padding="0.5rem">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <Input
              {...field}
              ringColor="border.200"
              placeholder={t("sendMessagePlaceholder")}
              borderRightRadius={0}
              type="textarea"
            />
          )}
        />
        <ButtonGroup isAttached variant="outline">
          <IconButton
            aria-label="Insert Card"
            backgroundColor="border.200"
            borderLeftRadius={0}
            icon={<TbCards />}
            type="button"
          />
          <IconButton
            aria-label="Attach File"
            backgroundColor="border.200"
            icon={<GrFormAttachment />}
            type="button"
          />
          <IconButton
            aria-label="Send Message"
            backgroundColor="accent.500"
            color="bg"
            icon={<BsFillCursorFill />}
            type="submit"
            isLoading={sendMessageMutation.isPending}
          />
        </ButtonGroup>
      </Stack>
    </form>
  );
}
