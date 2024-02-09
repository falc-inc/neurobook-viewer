import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const setupMsw = () => {
  const worker = setupWorker(...handlers);
  return worker.start({
    quiet: true,
  });
};
