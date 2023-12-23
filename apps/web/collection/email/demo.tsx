/* import { z } from "zod";

import {
  Base,
  Button,
  Container,
  Heading,
  Section,
  Text,
} from "@/collection/email";

export const TemplateName = "ForgotPasswordEmail";

export const TemplateStruct = z.object({
  firstName: z.string(),
  invitationLink: z.string(),
});

export type TemplateProps = z.infer<typeof TemplateStruct>;

export const Template = ({ firstName, invitationLink }: TemplateProps) => (
  <Base preview="Einladung">
    <Container>
      <Heading>Einladung</Heading>
      <Section>
        <Text>Hey {firstName},</Text>
        <Text>
          du wurdest dazu eingeladen, unser Tool zu nutzen. Nutze den folgenden
          Button, um die Einladung anzunehmen und dich zu registrieren.
        </Text>
        <Button href={invitationLink}>Einladung annehmen</Button>
        <Text>
          Beste Grüße, <br />
          Dein Mustermann Team
        </Text>
      </Section>
    </Container>
  </Base>
);
 */
