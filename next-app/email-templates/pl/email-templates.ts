import type { Person } from "./common";
import { emailWrapper } from "./common";

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
