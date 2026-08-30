import app from "./app.js";
import { connectDatabase } from "./database/database.service.js";
import { PORT } from "./config/config.service.js";

async function bootstrap() {
    // 1. Connect Database
    await connectDatabase();

    // 2. Start HTTP Server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} 🚀😉`);
    });
}

bootstrap();
