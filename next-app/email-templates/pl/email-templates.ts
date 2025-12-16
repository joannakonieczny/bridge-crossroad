import type { TournamentType } from "@/club-preset/event-type";
import { EventType } from "@/club-preset/event-type";
import type { Person } from "./common";
import { emailWrapper, getPersonLabel } from "./common";
import type { DurationType } from "@/schemas/common";
import { getDurationLabel } from "@/util/formatters";

type TemplateReturnType = {
  subject: string;
  body: string;
};

export const newlyCreatedAccountTemplate = ({
  person,
}: {
  person: Person;
}): TemplateReturnType => {
  const subject = "Witamy w Bridge Crossroad!";
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Witamy w <strong>Bridge Crossroad</strong>!
      </p>

      <p>
        Twoje konto zostało pomyślnie utworzone. 
        Pamiętaj, aby ukończyć konfiguracje konta, 
        bez tego nie możemy aktywować twojego profilu i nie będziesz mógł korzystać z pełnej funkcjonalności platformy.
      </p>

      <p>
        Jeśli to nie Ty zakładałeś konto lub masz pytania,
        skontaktuj się z nami.
      </p>

      <p>
        Życzymy powodzenia i dobrej zabawy!
      </p>
    `,
  });

  return { subject, body };
};

export const forgetPasswordTemplate = ({
  temporaryPassword,
  person,
}: {
  temporaryPassword: string;
  person: Person;
}): TemplateReturnType => {
  const subject = "Reset hasła";
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>Otrzymaliśmy prośbę o resetowanie hasła do Twojego konta.</p>
      <p>Twoje tymczasowe hasło:</p>
      <p><strong>${temporaryPassword}</strong></p>
      <p>Zaloguj się, a później zmień hasło w ustawieniach konta.</p>
    `,
  });

  return { subject, body };
};

export const findPartnerNewInterestedTemplate = ({
  playerName,
  playerEmail,
  playerLevel,
  person,
}: {
  playerName: string;
  playerEmail: string;
  playerLevel: string;
  person: Person;
}): TemplateReturnType => {
  const subject = "Nowe zainteresowanie";
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Gracz <strong>${playerName}</strong> wyraził zainteresowanie
        zagraniem z Tobą.
      </p>
      <p>Dane gracza:</p>
      <ul>
        <li>Email: ${playerEmail}</li>
        <li>Poziom: ${playerLevel}</li>
      </ul>
    `,
  });

  return { subject, body };
};

type TournamentEvent = {
  title: string;
  description?: string;
  location?: string;
  additionalDescription?: string;
  tournamentType?: TournamentType;
  duration: DurationType;
  organizer: Person;
  group: {
    name: string;
  };
  typeOfEvent: EventType.TOURNAMENT_PAIRS | EventType.TOURNAMENT_TEAMS;
  team?: {
    name: string;
    members: Person[];
  };
};

type TournamentRegistrationEmailParams = {
  partner: Person;
  person: Person;
  tournamentEvent: TournamentEvent;
};

export const tournamentRegistrationTemplate = ({
  partner,
  person,
  tournamentEvent,
}: TournamentRegistrationEmailParams): TemplateReturnType => {
  const subject = `Zapis na turniej: ${tournamentEvent.title} przez partnera w grupie ${tournamentEvent.group.name}`;
  const body = emailWrapper({
    person,
    title: `Zapis na turniej: ${tournamentEvent.title} przez partnera w grupie ${tournamentEvent.group.name}`,
    content: `
      <p>
        Zostałeś właśnie zapisany na turniej ${
          tournamentEvent.typeOfEvent === EventType.TOURNAMENT_TEAMS
            ? "drużynowy"
            : ""
        } przez partnera: <strong>${getPersonLabel(
      partner
    )}</strong> w grupie: <strong>${tournamentEvent.group.name}</strong>.
      </p>
      <p><strong>Szczegóły turnieju:</strong></p>
      <p><strong>Tytuł:</strong> ${tournamentEvent.title}</p>
      ${
        tournamentEvent.description
          ? `<p><strong>Opis:</strong><br />${tournamentEvent.description}</p>`
          : ""
      }
      ${
        tournamentEvent.additionalDescription
          ? `<p><strong>Dodatkowy opis:</strong><br />${tournamentEvent.additionalDescription}</p>`
          : ""
      }
      ${
        tournamentEvent.location
          ? `<p><strong>Lokalizacja:</strong> ${tournamentEvent.location}</p>`
          : ""
      }
      <p><strong>Typ turnieju:</strong> ${
        tournamentEvent.typeOfEvent === EventType.TOURNAMENT_PAIRS
          ? "Turniej par"
          : "Turniej drużynowy"
      }</p>

      <p><strong>Czas trwania:</strong> ${getDurationLabel(
        tournamentEvent.duration
      )}</p>
      <p><strong>Organizator:</strong> ${getPersonLabel(
        tournamentEvent.organizer
      )}</p>
      <p><strong>Grupa:</strong> ${tournamentEvent.group.name}</p>
      ${
        tournamentEvent.typeOfEvent === EventType.TOURNAMENT_TEAMS &&
        tournamentEvent.team
          ? `<p><strong>Nazwa twojej drużyny: ${
              tournamentEvent.team.name
            }</strong></p>
             <ul>
               ${tournamentEvent.team.members
                 .map((m) => `<li>${getPersonLabel(m)}</li>`)
                 .join("")}
             </ul>`
          : ""
      }
      <p>
        Ważne: samo zapisanie się na turniej nie oznacza potwierdzenia obecności. 
        Aby inni uczestnicy widzieli, że będziesz na wydarzeniu, należy <strong>potwierdzić swoją obecność</strong>.
      </p>
    `,
  });
  return { subject, body };
};

export const tournamentUnregistrationTemplate = ({
  partner,
  person,
  tournamentEvent,
}: TournamentRegistrationEmailParams): { subject: string; body: string } => {
  const subject = `Wyrejestrowanie z turnieju: ${tournamentEvent.title} w grupie ${tournamentEvent.group.name}`;

  const body = emailWrapper({
    person,
    title: `Wyrejestrowanie z turnieju: ${tournamentEvent.title} w grupie ${tournamentEvent.group.name}`,
    content: `
      <p>
        Twój partner <strong>${getPersonLabel(
          partner
        )}</strong> wyrejestrował Cię z turnieju ${
      tournamentEvent.typeOfEvent === EventType.TOURNAMENT_TEAMS
        ? "drużynowego"
        : ""
    } w grupie <strong>${tournamentEvent.group.name}</strong>.
      </p>

      <p><strong>Szczegóły turnieju:</strong></p>

      <p><strong>Tytuł:</strong> ${tournamentEvent.title}</p>
      ${
        tournamentEvent.description
          ? `<p><strong>Opis:</strong><br />${tournamentEvent.description}</p>`
          : ""
      }
      ${
        tournamentEvent.additionalDescription
          ? `<p><strong>Dodatkowy opis:</strong><br />${tournamentEvent.additionalDescription}</p>`
          : ""
      }
      ${
        tournamentEvent.location
          ? `<p><strong>Lokalizacja:</strong> ${tournamentEvent.location}</p>`
          : ""
      }
      <p><strong>Typ turnieju:</strong> ${
        tournamentEvent.typeOfEvent === EventType.TOURNAMENT_PAIRS
          ? "Turniej par"
          : "Turniej drużynowy"
      }</p>
      <p><strong>Czas trwania:</strong> ${getDurationLabel(
        tournamentEvent.duration
      )}</p>
      <p><strong>Organizator:</strong> ${getPersonLabel(
        tournamentEvent.organizer
      )}</p>
      <p><strong>Grupa:</strong> ${tournamentEvent.group.name}</p>

      ${
        tournamentEvent.typeOfEvent === EventType.TOURNAMENT_TEAMS &&
        tournamentEvent.team
          ? `<p><strong>Nazwa Twojej drużyny: ${
              tournamentEvent.team.name
            }</strong></p>
             <ul>
               ${tournamentEvent.team.members
                 .map((m) => `<li>${getPersonLabel(m)}</li>`)
                 .join("")}
             </ul>`
          : ""
      }

      <p>
        Pamiętaj, że po wyrejestrowaniu z turnieju Twoja deklaracja obecności na wydarzeniu nie została wycofana. 
        Jeśli nadal chcesz wziąć udział w wydarzeniu, skontaktuj się z partnerem lub ponownie zarejestruj się na niego.
      </p>
    `,
  });

  return { subject, body };
};

export const partnershipInterestNotificationTemplate = ({
  interestedPlayer,
  postName,
  person,
}: {
  interestedPlayer: Person;
  postName: string;
  person: Person;
}): TemplateReturnType => {
  const subject = `Nowe zainteresowanie Twoim ogłoszeniem: ${postName}`;
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Gracz <strong>${getPersonLabel(
          interestedPlayer
        )}</strong> wyraził zainteresowanie Twoim ogłoszeniem o poszukiwaniu partnera.
      </p>
      <p><strong>Nazwa ogłoszenia:</strong> ${postName}</p>
      <p>
        Zaloguj się do Bridge Crossroad, aby zobaczyć szczegóły swojego ogłoszenia..
      </p>
    `,
  });

  return { subject, body };
};

export const promotedToAdminTemplate = ({
  groupName,
  person,
  promotedBy,
}: {
  groupName: string;
  person: Person;
  promotedBy: Person;
}): TemplateReturnType => {
  const subject = `Awans na administratora w grupie: ${groupName}`;
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Gratulacje! Zostałeś awansowany na <strong>administratora</strong> w grupie <strong>${groupName}</strong> przez <strong>${getPersonLabel(
      promotedBy
    )}</strong>.
      </p>
      <p>
        Jako administrator grupy otrzymujesz dodatkowe uprawnienia do zarządzania grupą, 
        organizowania wydarzeń oraz moderowania treści.
      </p>
      <p>
        Zaloguj się do Bridge Crossroad, aby zarządzać swoją grupą.
      </p>
    `,
  });

  return { subject, body };
};

export const demotedFromAdminTemplate = ({
  groupName,
  person,
  demotedBy,
}: {
  groupName: string;
  person: Person;
  demotedBy: Person;
}): TemplateReturnType => {
  const subject = `Utrata praw administratora w grupie: ${groupName}`;
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Administrator <strong>${getPersonLabel(
          demotedBy
        )}</strong> odebrał Ci uprawnienia administratora w grupie <strong>${groupName}</strong>.
      </p>
      <p>
        Nadal pozostajesz członkiem grupy i możesz brać udział we wszystkich wydarzeniach, 
        ale nie masz już uprawnień do zarządzania grupą.
      </p>
      <p>
        W razie pytań skontaktuj się z administratorami grupy.
      </p>
    `,
  });

  return { subject, body };
};

export const onboardingCompletedTemplate = ({
  person,
  groupName,
}: {
  person: Person;
  groupName: string;
}): TemplateReturnType => {
  const subject = "Gratulacje! Twoje konto zostało w pełni aktywowane";
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Gratulacje! Pomyślnie ukończyłeś proces konfiguracji konta w <strong>Bridge Crossroad</strong>.
      </p>
      <p>
        Zostałeś dodany do grupy głównej: <strong>${groupName}</strong>.
      </p>
      <p>
        Od teraz możesz korzystać z pełnego potencjału aplikacji:
      </p>
      <ul>
        <li>Przeglądać i zapisywać się na wydarzenia</li>
        <li>Szukać partnerów do gry</li>
        <li>Dołączać do turniejów i rozgrywek</li>
        <li>Komunikować się z innymi członkami społeczności</li>
        <li>Tworzyć własne wydarzenia i zarządzać nimi</li>
      </ul>
      <p>
        Zaloguj się do Bridge Crossroad i rozpocznij swoją przygodę z brydżem!
      </p>
    `,
  });

  return { subject, body };
};

export const findPartnerPlayerAgreenTemplate = ({
  playerName,
  playerEmail,
  acceptanceDate,
  person,
}: {
  playerName: string;
  playerEmail: string;
  acceptanceDate: string;
  person: Person;
}): TemplateReturnType => {
  const subject = "Partnerstwo zaakceptowane";
  const body = emailWrapper({
    person,
    title: subject,
    content: `
      <p>
        Świetna wiadomość! Gracz <strong>${playerName}</strong>
        zaakceptował prośbę o partnerstwo.
      </p>
      <p>Dane gracza:</p>
      <ul>
        <li>Email: ${playerEmail}</li>
        <li>Data akceptacji: ${acceptanceDate}</li>
      </ul>
    `,
  });

  return { subject, body };
};
