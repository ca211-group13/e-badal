import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { PORT } from "./src/config/dotenv.js";
connectDB();
app.get("/", (req, res) => {
  res.send(200, "heellow is workign good");
});

app.listen(PORT, () => {
  console.log("app is lesting on port ", PORT);
});
