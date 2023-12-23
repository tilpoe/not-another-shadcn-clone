import type { ReactElement } from "react";
import { render } from "jsx-email";
import type { SentMessageInfo } from "nodemailer";
import nodemailer from "nodemailer";

interface Mail {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;

  component?: ReactElement;
}

type MailSentState = {
  info: SentMessageInfo;
} & (
  | {
      ok: true;
    }
  | {
      ok: false;
      error: Error;
    }
);

/**
 *
 * @param mail
 * @returns
 * @throws Error
 */
export async function sendMail(mail: Mail) {
  const { from, html, component, ...restMail } = mail;
  const transporter = nodemailer.createTransport(process.env.MAILER);

  let htmlContent: string | undefined = undefined;
  if (component) {
    htmlContent = (await render(component)).trim();
  } else if (html) {
    htmlContent = html.trim();
  }

  return await new Promise<MailSentState>((res) => {
    transporter.sendMail(
      {
        from: from ?? '"Max Mustermann" <no-reply@mustermann.de>',
        html: htmlContent,
        ...restMail,
      },
      (err, info) => {
        if (err) {
          res({
            ok: false,
            error: err,
            info,
          });
        } else {
          res({
            ok: true,
            info,
          });
        }
      },
    );
  });
}
