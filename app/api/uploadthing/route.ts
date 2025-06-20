import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "../../../lib/core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
