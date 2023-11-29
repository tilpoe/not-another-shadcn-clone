import { toast as showToast } from "sonner";

export const toast = {
  ...showToast,
  error: (message = "Es ist ein Fehler aufgetreten.") => {
    showToast.error(message);
  },
};
