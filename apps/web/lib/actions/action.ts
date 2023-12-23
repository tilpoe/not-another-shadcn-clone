import { createBetterActionClient } from "@/lib/actions";
import { getSession } from "@/server/auth/server";

export const action = createBetterActionClient({
  async middleware(opts: { public?: boolean }) {
    const session = await getSession();

    if (!opts?.public && !session?.user) {
      throw new Error("Unauthorized");
    }

    return {
      session,
    };
  },
});
