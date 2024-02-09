import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const setupMsw = async () => {
  const worker = setupWorker(...handlers);
  return worker.start({
    quiet: true,
  });
};
