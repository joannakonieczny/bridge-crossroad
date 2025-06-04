import { userSchema } from "./user";

export enum KrakowAcademy {
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

export enum Month {
  JANUARY = "styczeń",
  FEBRUARY = "luty",
  MARCH = "marzec",
  APRIL = "kwiecień",
  MAY = "maj",
  JUNE = "czerwiec",
  JULY = "lipiec",
  AUGUST = "sierpień",
  SEPTEMBER = "wrzesień",
  OCTOBER = "październik",
  NOVEMBER = "listopad",
  DECEMBER = "grudzień",
}

export enum TrainingGroup {
  PODSTAWOWA = "grupa podstawowa",
  SREDNIOZAAWANSOWANA = "średniozaawansowana",
  ZAAWANSOWANA = "zaawansowana",
  TRENER = "Jestem trenerem!",
  NIE_UCZESTNICZE = "Nie chodzę na zajęcia z brydża na AGH",
}

export const minYear = 1900;

export const nicknameSchema = {
  ...userSchema.loginSchema,
};
