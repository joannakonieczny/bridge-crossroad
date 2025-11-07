"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { addEventSchema } from "@/schemas/pages/with-onboarding/events/events-schema";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormLabel,
  Box,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/react";
import { PrimaryInfoStep } from "./step/PrimaryInfoStep";
import { DetailedInfoStep } from "./step/DetailedInfoStep/DetailedInfoStep";
import { SummaryStep } from "./step/SummaryStep";

type EventFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      group: "",
      organizer: "",
      duration: {
        startsAt: new Date(),
        endsAt: new Date(),
      },
      additionalDescription: "",
      imageUrl: undefined, //TODO add image upload in future
      data: {},
    },
  });

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });

  const steps = [
    {
      title: "Podstawowe informacje",
      content: <PrimaryInfoStep setNextStep={() => setActiveStep(1)} />,
    },
    {
      title: "Szczegóły wydarzenia",
      content: (
        <DetailedInfoStep
          setNextStep={() => setActiveStep(2)}
          setPrevStep={() => setActiveStep(0)}
        />
      ),
    },
    {
      title: "Podsumowanie",
      content: <SummaryStep setPrevStep={() => setActiveStep(1)} />,
    },
  ];

  const max = steps.length - 1;

  const onSubmit = (data: unknown) => {
    // eslint-disable-next-line no-console
    console.log("Form submit - valid data:", data);
  };

  const onError = (errors: unknown) => {
    // eslint-disable-next-line no-console
    console.log("Form submit - validation errors:", errors);
    // eslint-disable-next-line no-console
    console.log("Form current values:", form.getValues());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Dodaj wydarzenie</ModalHeader>
        <ModalCloseButton />
        <Divider />
        <ModalBody>
          <FormProvider {...form}>
            <form
              id="event-form"
              onSubmit={form.handleSubmit(onSubmit, onError)}
            >
              <FormLabel htmlFor="title">{steps[activeStep].title}</FormLabel>
              <Box position="relative">
                <Stepper size="lg" index={activeStep}>
                  {steps.map((_, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          incomplete={<StepNumber />}
                          active={<StepNumber />}
                        />
                      </StepIndicator>
                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Box mt={8}>{steps[activeStep].content}</Box>
              <Button
                colorScheme={activeStep == max ? "blue" : "gray"}
                variant={activeStep == max ? "solid" : "outline"}
                disabled={activeStep != max}
                type="submit"
                form="event-form"
              >
                Dodaj wydarzenie
              </Button>
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
