import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const itemRouter = router({
    addItem: publicProcedure
        .input(z.object({
            name: z.string(),
        }))
        .mutation( async ({ input, ctx }) => {
            const { name } = input
            const item = await ctx.prisma.shoppingItem.create({
                data: {
                    name
                },
            })
            return item
        })
})