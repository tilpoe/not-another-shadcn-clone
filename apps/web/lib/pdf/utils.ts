import { renderToStream } from "@react-pdf/renderer";

export const streamToBuffer = async (
  stream: NodeJS.ReadableStream,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (data) => {
      chunks.push(data as Buffer);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
};

export const generatePdfFromComponent = async (component: JSX.Element) => {
  // convert react component to stream
  const pdfStream = await renderToStream(component);
  // create buffer from stream
  const pdfBuffer = await streamToBuffer(pdfStream);
  return pdfBuffer;
};
