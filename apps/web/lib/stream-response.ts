import { z } from "zod";

export interface StreamStatus {
  queue: string[];
  started: boolean;
  finished: boolean;
  error: string | null;
}

/**
 * Manages the status updates of the streamed response.
 */
export function createStreamStatus(): StreamStatus {
  return {
    queue: [],
    started: false,
    finished: false,
    error: null,
  };
}

export class Streamer {
  private encoder: TextEncoder;
  private status: StreamStatus;
  private lastYield: Date | null = null;

  constructor() {
    this.encoder = new TextEncoder();
    this.status = createStreamStatus();
  }

  start() {
    this.status.started = true;
  }

  stop() {
    this.status.finished = true;
  }

  setError(error: unknown) {
    this.status.error = String(error);
  }

  reset() {
    this.status = createStreamStatus();
  }

  canYield() {
    if (!this.lastYield) {
      this.lastYield = new Date();
    }

    return new Date().getTime() - this.lastYield.getTime() > 500;
  }

  yield(data: string, checkIfCanYield = true) {
    if (checkIfCanYield && !this.canYield()) {
      return;
    }

    this.lastYield = new Date();
    this.status.queue.push(data);
  }

  getStatus() {
    return this.status;
  }

  getEncoder() {
    return this.encoder;
  }

  getError() {
    return this.status.error;
  }

  emptyQueue() {
    this.status.queue = [];
  }

  getQueue() {
    return this.status.queue;
  }

  encode(data: string | undefined, type: "message" | "error" = "message") {
    return this.encoder.encode(createEncoderMessage(data, type));
  }

  pop() {
    return this.encode(this.status.queue.shift());
  }
}

/**
 * Create this object on top of your route handler to manage the stream.
 *
 * Usage:
 * 1. Set status.started to true when you start streaming.
 * 2. Push the updates to status.queue. Check if enough time has passed with "canYield".
 * 3. Set status.finished to true when you are done streaming.
 * 4. Return "streamResponse(iterator(<object>))" from your route handler.
 */
export const createStreamer = () => ({
  encoder: new TextEncoder(),
  status: createStreamStatus(),
});

/**
 * Get the current status of the stream.
 */
export function isStreaming(streamStatus: StreamStatus) {
  return (
    streamStatus.queue.length > 0 ||
    (!streamStatus.started && !streamStatus.finished) ||
    (!streamStatus.finished && streamStatus.started) ||
    streamStatus.error
  );
}

/**
 * Yield the stream updates.
 */
export function createEncoderMessage(
  data: string | undefined,
  type: "message" | "error" = "message",
) {
  if (data) {
    return JSON.stringify({
      status: type === "message" ? "ok" : "error",
      data: data,
    });
  }

  return undefined;
}

/**
 * Iterator for the stream. Use this as return with "streamResponse(iterator(<object>))".
 */
export async function* createIteratorFromStreamer(streamer: Streamer) {
  while (isStreaming(streamer.getStatus())) {
    const error = streamer.getError();
    if (error) {
      yield streamer.encode(error, "error");
      streamer.emptyQueue();
      streamer.stop();
    }

    if (streamer.getQueue().length > 0) {
      yield streamer.pop();
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

/**
 * Convert the iterator to a stream.
 */
export function iteratorToStream(iterator: AsyncGenerator) {
  return new ReadableStream({
    async pull(controller) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

/**
 * Use to return the stream from the route handler.
 */
export function streamResponse(iterator: AsyncGenerator) {
  return new Response(iteratorToStream(iterator));
}

/**
 * Read the streamed response on the client.
 */
export async function readDataStream(
  response: Response,
  whileReading: (chunck: { data: string }) => void,
): Promise<
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
      type: "BAD_RESPONSE" | "BAD_BODY" | "CUSTOM";
    }
> {
  if (!response.ok) {
    return {
      ok: false,
      error: "",
      type: "BAD_RESPONSE",
    };
  }

  if (!response.body) {
    return {
      ok: false,
      error: "",
      type: "BAD_BODY",
    };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let finishedStreaming = false;

  let error = "";
  while (!finishedStreaming) {
    const { value, done } = await reader.read();
    finishedStreaming = done;
    const chunk = decoder.decode(value);

    if (!chunk) {
      continue;
    }

    try {
      const chunkJson = JSON.parse(chunk) as unknown;
      const parsedChunk = z
        .object({
          status: z.union([z.literal("ok"), z.literal("error")]),
          data: z.string(),
        })
        .safeParse(chunkJson);

      if (!parsedChunk.success) {
        error = "Error while parsing streamed message: wrong JSON format";
        finishedStreaming = true;
      } else {
        if (parsedChunk.data.status === "error") {
          finishedStreaming = true;
          error = parsedChunk.data.data;
        } else {
          whileReading({
            data: parsedChunk.data.data,
          });
        }
      }
    } catch (err) {
      error = "Error while parsing streamed message: invalid JSON";
      finishedStreaming = true;
    }
  }

  if (error) {
    return {
      ok: false,
      error,
      type: "CUSTOM",
    };
  }

  return {
    ok: true,
  };
}
