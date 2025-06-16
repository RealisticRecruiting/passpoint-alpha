import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/utils/uploadthing";


console.log("🔒 UPLOADTHING_SECRET on server:", process.env.UPLOADTHING_SECRET);


export const runtime = "nodejs";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
});
