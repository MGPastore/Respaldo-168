// app.js
import express from "express";
import http from "http";

class App {
  constructor(bot) {
    this.bot = bot; // recibe new Telegraf(TOKEN)
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.get("/", (req, res) => {
      res.send("Servidor Express funcionando 🚀");
    });
  }

  async start() {
    try {
      // Inicializar el bot
      await this.bot.launch();
      console.log("🤖 Bot de Telegram iniciado correctamente");

      // Inicializar el servidor
      this.server.listen(this.port, () => {
        console.log(`🚀 Servidor Express corriendo en http://localhost:${this.port}`);
      });

      // Manejar señales de apagado limpio
      process.once("SIGINT", () => this.bot.stop("SIGINT"));
      process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    } catch (error) {
      console.error("❌ Error al iniciar la App:", error);
    }
  }
}

export default App;
