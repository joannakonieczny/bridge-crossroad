"use client";

import { KrakowAcademy, TrainingGroup } from "@/schemas/user";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface FirstPage {
  university: KrakowAcademy;
  yearOfBirth: number;
}

interface SecondPage {
  playingExperience: number;
  trainingGroup: TrainingGroup;
  hasRefereeLicence: boolean;
}

interface ThirdPage {
  CezarId?: string;
  BBOId?: string;
  CuebidsId?: string;
}

type FormData = {
  firstPage?: FirstPage;
  secondPage?: SecondPage;
  thirdPage?: ThirdPage;
};

type FormDataContextType = {
  formData: FormData;
  setData: (params: SetDataParams) => void;
  clearData: () => void;
};

interface SetDataParams {
  page: number;
  data: FirstPage | SecondPage | ThirdPage;
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
        case 1:
          newData.firstPage = data as FirstPage;
          break;
        case 2:
          newData.secondPage = data as SecondPage;
          break;
        case 3:
          newData.thirdPage = data as ThirdPage;
          break;
        default:
          throw new Error(`Invalid page number got: ${page} expected 1-3`);
      }
      storeData();
      alert(`Data for page ${page} set successfully: ${JSON.stringify(data)}`);
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
