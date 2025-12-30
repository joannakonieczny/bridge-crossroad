import * as cheerio from "cheerio";
import type { CezarPlayer } from "@/schemas/model/cezar-player/cezar-player-schema";

export async function fetchCezarPlayerByPid(
  pid: string
): Promise<CezarPlayer> {
  const url = `https://msc.com.pl/cezar/?p=21&pid_search=${encodeURIComponent(
    pid
  )}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch CEZAR page");
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  //główny TD z danymi zawodnika
  const dataTd = $('td:has(span[style*="font-size:28px"])').first();

  if (!dataTd.length) {
    throw new Error("Player data not found");
  }

  // Imię i nazwisko
  const fullName = dataTd
    .find('span[style*="font-size:28px"]')
    .first()
    .text()
    .trim();

  // WK
  const wk = dataTd
    .find('span:contains("WK") span[style*="font-size: 24px"]')
    .first()
    .text()
    .trim();

  // Klub (Drużyna)
  const klub =
    dataTd.find('span:contains("Drużyna") a b').first().text().trim() ||
    null;

  // Okręg – tekst typu: "Małopolski WZBS (MP)"
  const okregMatch = dataTd
    .text()
    .match(/\(([A-Z]{2,3})\)/);

  const okreg = okregMatch?.[1];

  if (!fullName || !wk || !okreg) {
    throw new Error("Incomplete player data");
  }

  return {
    pid,
    fullName,
    wk,
    klub,
    okreg,
  };
}
