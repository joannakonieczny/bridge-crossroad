"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

enum Academies {
  UNIWERSYTET_JAGIELLONSKI = "Uniwersytet Jagielloński",
  AGH = "Akademia Górniczo-Hutnicza im. Stanisława Staszica",
  POLITECHNIKA_KRAKOWSKA = "Politechnika Krakowska im. Tadeusza Kościuszki",
  UNIWERSYTET_EKONOMICZNY = "Uniwersytet Ekonomiczny w Krakowie",
  UNIWERSYTET_PEDAGOGICZNY = "Uniwersytet Pedagogiczny im. Komisji Edukacji Narodowej",
  UNIWERSYTET_ROLNICZY = "Uniwersytet Rolniczy im. Hugona Kołłątaja",
  AKADEMIA_SZTUK_PIEKNYCH = "Akademia Sztuk Pięknych im. Jana Matejki",
  AKADEMIA_MUZYCZNA = "Akademia Muzyczna w Krakowie",
  AKADEMIA_WYCHOWANIA_FIZYCZNEGO = "Akademia Wychowania Fizycznego im. Bronisława Czecha",
  AKADEMIA_TEOLOGICZNA = "Uniwersytet Papieski Jana Pawła II",
  AKADEMIA_IGNATIANUM = "Uniwersytet Ignatianum w Krakowie",
  INNA = "Inna",
}

enum TrainingGroup {
  PODSTAWOWA = "grupa podstawowa",
  SREDNIOZAAWANSOWANA = "średniozaawansowana",
  ZAAWANSOWANA = "zaawansowana",
  TRENER = "Jestem trenerem!",
  NIE_UCZESTNICZE = "Nie chodzę na zajęcia z brydża na AGH",
}

//Wazne dane personalne
interface FirstPage {
  nickname?: string;
  academy: Academies;
  yearOfBirth: number;
}

//Informacje o doświadczeniu
interface SecondPage {
  startPlayingDate: string; // Format: YYYY-MM-DD , ISO date
  yearOfStartingPlaying: number;
  trainingGroup: TrainingGroup;
  hasRefereeLicence: boolean;
}

//Profile brydżowe
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
