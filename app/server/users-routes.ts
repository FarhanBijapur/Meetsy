import { auth } from "@clerk/nextjs/server";
import { authMiddleware } from "./middleware/auth-middleware";
import { Hono } from "hono";

type Variables = {
  userId: string;
};

export const userApp = new Hono<{ Variables: Variables }>()
  .use("/*", authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    const { has } = await auth();
    const isPro = has({ plan: "pro_plan" });
    return c.json({
      ...user,
      isPro,
    });
  });
