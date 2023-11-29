import { useSession as useDefaultSession } from "next-auth/react";

export function useSession() {
  const { data, status, update } = useDefaultSession();

  if (!data) {
    throw new Error();
  }

  return {
    session: data,
    status,
    update,
  };
}
