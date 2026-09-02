import app from "./app.js";
import { connectDatabase } from "./database/database.service.js";
import { PORT } from "./config/config.service.js";
import dns from "node:dns";

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function bootstrap() {
  // 1. Connect Database
  await connectDatabase();

  // 2. Start HTTP Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀😉`);
  });
}

bootstrap();
