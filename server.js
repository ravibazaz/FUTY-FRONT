import next from "next";
import express from "express";
import path from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // ✅ Serve uploaded images directly
  server.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  // All other Next.js routes
  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
