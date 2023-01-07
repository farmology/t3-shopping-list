import { router } from "../trpc";
import { authRouter } from "./auth";
import { itemRouter } from "./itemRouter";

export const appRouter = router({
  auth: authRouter,
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
