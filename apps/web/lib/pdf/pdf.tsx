import { Document, Page, View } from "@react-pdf/renderer";

export const Pdf = ({
  children,
  title,
  padding = {
    left: "2.2cm",
    right: "2.2cm",
    top: "1.69cm",
    bottom: "1.69cm",
  },
}: {
  children: React.ReactNode;
  title: string;
  padding?: {
    left?: string;
    right?: string;
    bottom?: string;
    top?: string;
  };
}) => {
  return (
    <Document title={title}>
      <Page
        size="A4"
        style={{
          fontFamily: "Helvetica",
          paddingBottom: padding.bottom,
          paddingTop: padding.top,
          paddingLeft: padding.left,
          paddingRight: padding.right,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {children}
        </View>
      </Page>
    </Document>
  );
};
