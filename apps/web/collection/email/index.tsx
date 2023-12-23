/* import {
  Body,
  Head,
  Html,
  Link,
  Button as MailButton,
  Container as MailContainer,
  Heading as MailHeading,
  Section as MailSection,
  Text as MailText,
  Preview,
} from "jsx-email";

export const Base = ({
  children,
  preview,
}: {
  children?: React.ReactNode;
  preview: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
          backgroundColor: "#f6f9fc",
          paddingTop: "64px",
        }}
      >
        {children}
        <MailContainer
          style={{
            margin: "0 auto",
            marginBottom: "64px",
            padding: "20px 0 48px",
            fontSize: "0.6rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Max Mustermann GmbH
          <br />
          Musterstraße 12, 06849 Musterstadt
          <br />
          Geschäftsführer: Max Mustermann
          <br />
          Amtsgericht Muster
          <br />
          USt-IdNr. Muster Kontakt:{" "}
          <Link href={"mailto:support@feierstoff.de"}>muster-email</Link> <br />
          Tel: 0341 -
        </MailContainer>
      </Body>
    </Html>
  );
};

export const Button = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) => {
  return (
    <MailButton
      href={href}
      style={{
        padding: "12px 0",
        backgroundColor: "#cc0033",
        borderRadius: "4px",
        fontWeight: "bolder",
        textAlign: "center",
        textDecoration: "none",
        width: "100%",
        color: "white",
        display: "block",
        fontSize: "14px",
      }}
    >
      {children}
    </MailButton>
  );
};

export const Container = ({ children }: { children?: React.ReactNode }) => {
  return (
    <MailContainer
      style={{
        backgroundColor: "#ffffff",
        margin: "0 auto",
        marginBottom: "32px",
        padding: "20px 0 48px",
        boxShadow: "0 0.0625rem 0 #00000012",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    >
      {children}
    </MailContainer>
  );
};

export const Heading = ({ children }: { children?: React.ReactNode }) => {
  return (
    <MailHeading
      style={{
        color: "black",
        fontSize: "24px",
        padding: "0 48px",
      }}
    >
      <strong>{children}</strong>
    </MailHeading>
  );
};

export const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <MailSection
      style={{
        padding: "0 48px",
      }}
    >
      {children}
    </MailSection>
  );
};

export const Text = ({
  children,
  size = "default",
}: {
  children: React.ReactNode;
  size?: "default" | "sm";
}) => {
  let fontSize;
  switch (size) {
    case "default":
      fontSize = "14px";
      break;
    case "sm":
      fontSize = "12px";
      break;
  }

  return (
    <MailText
      style={{
        color: "#000000",
        fontSize,
        lineHeight: "24px",
        textAlign: "left",
      }}
    >
      {children}
    </MailText>
  );
};
 */
