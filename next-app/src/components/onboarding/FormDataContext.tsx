"use client";

import { PageId } from "@/app/(logged)/onboarding/[page]/page";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { OnboardingFirstPageSchema } from "@/schemas/onboarding/first-page-schema";
import { OnboardingSecondPageSchema } from "@/schemas/onboarding/second-page-schema";
import { OnboardingThirdPageSchema } from "@/schemas/onboarding/third-page-schema";
import { OnboardingFinalPageSchema } from "@/schemas/onboarding/final-page-schema";

export type FormData = {
  firstPage?: OnboardingFirstPageSchema;
  secondPage?: OnboardingSecondPageSchema;
  thirdPage?: OnboardingThirdPageSchema;
  finalPage?: OnboardingFinalPageSchema;
};

type FormDataContextType = {
  formData: FormData;
  setData: (params: SetDataParams) => void;
  clearData: () => void;
};

interface SetDataParams {
  page: PageId;
  data:
    | OnboardingFirstPageSchema
    | OnboardingSecondPageSchema
    | OnboardingThirdPageSchema
    | OnboardingFinalPageSchema;
}

const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined
);

const storingKey = "onboardingFormData";

export const OnboardingFormDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<FormData>({});

  function setData({ page, data }: SetDataParams): void {
    setFormData((prevData) => {
      const newData = { ...prevData };
      switch (page) {
        case "1":
          newData.firstPage = data as OnboardingFirstPageSchema;
          break;
        case "2":
          newData.secondPage = data as OnboardingSecondPageSchema;
          break;
        case "3":
          newData.thirdPage = data as OnboardingThirdPageSchema;
          break;
        case "final":
          newData.finalPage = data as OnboardingFinalPageSchema;
          break;
        default:
          throw new Error(`Invalid page number got: ${page} expected 1-3`);
      }
      storeData();
      return newData;
    });
  }

  function storeData() {
    sessionStorage.setItem(storingKey, JSON.stringify(formData));
  }

  function clearData() {
    sessionStorage.removeItem(storingKey);
    setFormData({});
  }

  function getStoredData(): FormData | null {
    const storedData = sessionStorage.getItem(storingKey);
    if (storedData) {
      return JSON.parse(storedData) as FormData;
    }
    return null;
  }

  useEffect(() => {
    //on mount
    const storedData = getStoredData();
    if (storedData) {
      setFormData(storedData);
    }
  }, []);

  return (
    <FormDataContext.Provider value={{ formData, setData, clearData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useOnboardingFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
};
