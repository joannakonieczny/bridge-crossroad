import { e } from "../helpers";

export type Person = {
  nickname?: string;
  firstName: string;
};

export const getPersonLabel = (person: Person) => {
  if (!person) return "";
  return person.nickname ? person.nickname : person.firstName;
};

type EmailWrapperParams = {
  title?: string;
  content: string;
  person: Person;
};

export const emailHeader = (): string => `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td align="center">
      <h1 style="
        margin:0;
        font-size:24px;
        font-family:Arial, Helvetica, sans-serif;
      ">
        Bridge Crossroad
      </h1>
    </td>
  </tr>
</table>
`;

export const emailWrapper = ({
  title = "Bridge Crossroad",
  content,
  person,
}: EmailWrapperParams): string => `
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${e(title)}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
      <tr>
        <td align="center" style="padding:24px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
            <tr>
              <td style="
                padding:24px;
                font-family:Arial, Helvetica, sans-serif;
                font-size:14px;
                line-height:1.5;
                color:#000000;
              ">
                ${emailHeader()}

                <p>
                  Cześć ${e(getPersonLabel(person))},
                </p>

                ${content}

                <p style="margin-top:32px;">
                  Pozdrawiamy,<br />
                  <strong>Zespół Bridge Crossroad</strong>
                </p>

                <hr style="margin:24px 0; border:none; border-top:1px solid #dddddd;" />

                <p style="
                  font-size:12px;
                  color:#666666;
                  line-height:1.4;
                ">
                  Jeśli otrzymałeś tę wiadomość przez pomyłkę lub nie dotyczy ona Ciebie,
                  skontaktuj się z administratorem
                  <strong>Zespołu Bridge Crossroad</strong>
                  lub po prostu zignoruj tę wiadomość.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
