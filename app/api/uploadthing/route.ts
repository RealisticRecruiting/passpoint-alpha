import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/utils/uploadthing";


console.log("🔒 UPLOADTHING_SECRET on server:", process.env.UPLOADTHING_SECRET);
console.log("✅ UPLOADTHING_APP_ID:", process.env.UPLOADTHING_APP_ID);



export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
});
