import React from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Divider,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  RadioGroup,
  HStack,
  Radio,
  Box,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";
import { BiddingSystem } from "@/club-preset/partnership-post";
import { useTranslations } from "@/lib/typed-translations";

export async function createPartnerShip(postData: any) {
    //do wywalenia
}

const BIDDING_LABELS: Record<BiddingSystem, string> = {
  [BiddingSystem.ZONE]: BiddingSystem.ZONE,
  [BiddingSystem.COMMON_LANGUAGE]: BiddingSystem.COMMON_LANGUAGE,
  [BiddingSystem.DOUBLETON]: BiddingSystem.DOUBLETON,
  [BiddingSystem.SAYC]: BiddingSystem.SAYC,
  [BiddingSystem.BETTER_MINOR]: BiddingSystem.BETTER_MINOR,
  [BiddingSystem.WEAK_OPENINGS_SSO]: BiddingSystem.WEAK_OPENINGS_SSO,
  [BiddingSystem.TOTOLOTEK]: BiddingSystem.TOTOLOTEK,
  [BiddingSystem.NATURAL]: BiddingSystem.NATURAL,
  [BiddingSystem.OTHER]: BiddingSystem.OTHER,
};

export default function PartnershipForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const t = useTranslations("pages.FindPartnerPage.PartnershipForm");
  const common = useTranslations("common");

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      biddingSystem: "SAYC",
      data: {
        type: "SINGLE",
        eventId: "",
        startsAt: "",
        endsAt: "",
      },
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: any = {
      name: values.name,
      description: values.description,
      biddingSystem: values.biddingSystem,
      data: {
        type: values.data.type,
      },
    };
    if (values.data.type === "SINGLE") {
      payload.data.eventId = values.data.eventId;
    } else {
      payload.data.startsAt = values.data.startsAt ? new Date(values.data.startsAt).toISOString() : undefined;
      payload.data.endsAt = values.data.endsAt ? new Date(values.data.endsAt).toISOString() : undefined;
    }

    try {
      await createPartnerShip(payload);
      toast({ status: "success", title: t("toast.success") ?? "Ogłoszenie utworzone (placeholder)" });
      onClose();
    } catch (e) {
      toast({ status: "error", title: t("toast.error") ?? "Błąd podczas tworzenia (placeholder)" });
    }
  });

  const type = form.watch("data.type");

  return (
    <>
      <Button onClick={onOpen} colorScheme="accent">
        {t("addButton")}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("modalHeader")}</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit}>
                <FormControl mb={3} isRequired>
                  <FormLabel htmlFor="name">{t("nameLabel")}</FormLabel>
                  <Input id="name" {...form.register("name")} />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel htmlFor="description">{t("descriptionLabel")}</FormLabel>
                  <Textarea id="description" {...form.register("description")} />
                </FormControl>

                <FormControl mb={3}>
                  <FormLabel htmlFor="biddingSystem">{t("biddingSystemLabel")}</FormLabel>
                  <Select id="biddingSystem" {...form.register("biddingSystem")}>
                    {Object.values(BiddingSystem).map((v) => (
                      <option key={v} value={v}>
                        {common(`biddingSystem.${v}`) ?? String(v)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Box mb={3}>
                  <FormLabel>{t("typeLabel")}</FormLabel>
                  <RadioGroup
                    value={form.watch("data.type")}
                    onChange={(v) => form.setValue("data.type", v)}
                  >
                    <HStack spacing={4}>
                      <Radio value="SINGLE">{t("single")}</Radio>
                      <Radio value="PERIOD">{t("period")}</Radio>
                    </HStack>
                  </RadioGroup>
                </Box>

                {/* conditional fields */}
                {type === "SINGLE" && (
                  <FormControl mb={3} isRequired>
                    <FormLabel htmlFor="eventId">{t("eventIdLabel")}</FormLabel>
                    <Select id="eventId" {...form.register("data.eventId")}>
                      <option value="">{t("eventPlaceholder")}</option>
                      <option value="691b834873fb688327d065b6">
                        {t("exampleEvents.691b834873fb688327d065b6")}
                      </option>
                      <option value="some-other-event-id">
                        {t("exampleEvents.some-other-event-id")}
                      </option>
                    </Select>
                  </FormControl>
                )}

                {type === "PERIOD" && (
                  <>
                    <FormControl mb={3} isRequired>
                      <FormLabel htmlFor="startsAt">{t("startsAtLabel")}</FormLabel>
                      <Input id="startsAt" type="datetime-local" {...form.register("data.startsAt")} />
                    </FormControl>
                    <FormControl mb={3} isRequired>
                      <FormLabel htmlFor="endsAt">{t("endsAtLabel")}</FormLabel>
                      <Input id="endsAt" type="datetime-local" {...form.register("data.endsAt")} />
                    </FormControl>
                  </>
                )}

                <ModalFooter px={0}>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    {t("cancelButton")}
                  </Button>
                  <Button colorScheme="accent" type="submit">
                    {t("createButton")}
                  </Button>
                </ModalFooter>
              </form>
            </FormProvider>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
