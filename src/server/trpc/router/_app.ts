import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { itemRouter } from "./itemRouter";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
