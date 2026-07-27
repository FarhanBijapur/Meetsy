import { auth } from "@clerk/nextjs/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { communitiesApp } from "@/app/server/community-routes";
import { learningGoalsApp } from "@/app/server/learning-goals-routes";
import { matchesApp } from "@/app/server/matches-routes";
import { conversationsApp } from "@/app/server/conversations-routes";
import { userApp } from "@/app/server/users-routes";

type Variables = {
  userId: string;
};

const app = new Hono<{ Variables: Variables }>().basePath("/api");

//error handler
app.onError((err, c) => {
  console.error("API Error:", err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  //database errr
  if (err instanceof Error) {
    if (
      err.message.includes("violates") ||
      err.message.includes("constraint")
    ) {
      return c.json({ error: "Invalid data provided" }, 400);
    }

    if (
      err.message.includes("not found") ||
      err.message.includes("Not found")
    ) {
      return c.json({ error: err.message }, 404);
    }
  }

  return c.json({ error: "Internal Server Error" }, 500);
});
console.log(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 25)
);

console.log(
  process.env.CLERK_SECRET_KEY?.slice(0, 15)
);
// middleware
app.use("/*", async (c, next) => {
  const publicRoutes = ["/api/communities/all"];
  if (publicRoutes.includes(c.req.path)) {
    return await next();
  }

  const session = await auth();
  if (!session.userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  c.set("userId", session.userId);
  return await next();
});

export const routes = app
  .route("/communities", communitiesApp)
  .route("/communities", learningGoalsApp)
  .route("/matches", matchesApp)
  .route("/conversations", conversationsApp)
  .route("/user", userApp);

export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
