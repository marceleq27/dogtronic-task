import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sleep } from "@/utils";

export const shopsRouter = createTRPCRouter({
  getShops: publicProcedure.query(async ({ ctx }) => {
    await sleep(1000); // Simulate slow response/loading
    return ctx.db.shop.findMany();
  }),
});
