import { authMiddleware } from "@clerk/nextjs";
console.log("Middleware working...");
export default authMiddleware({
  publicRoutes: ["/", "api/webhooks/clerk"],
  ignoredRoutes: ["/api/webhooks/clerk"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
