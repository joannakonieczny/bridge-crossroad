"use server";

import { fullAuthAction } from "@/services/action-lib";

const CEZAR_CSV_URL =
  "http://www.msc.com.pl/cezar/download/baza.csv";

type CezarPerson = {
  pid: string;
  fullName: string;
  wk: string;
  klub: string | null;
  okreg: string;
};

export const importCezarCsvAction = fullAuthAction.action(
  async (): Promise<CezarPerson[]> => {
    const res = await fetch(CEZAR_CSV_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to download CEZAR CSV");
    }

    const csv = await res.text();

    const lines = csv
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const [, ...rows] = lines;

    return rows.map((row) => {
      const [
        PID,
        IMIE,
        NAZWISKO,
        WK,
        OKREG,
        ,
        KLUB,
      ] = row.split(";");

      return {
        pid: PID,
        fullName: `${IMIE} ${NAZWISKO}`,
        wk: WK,
        klub: KLUB || null,
        okreg: OKREG,
      };
    });
  }
);
