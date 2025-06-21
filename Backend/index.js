import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL;
const coreOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(coreOptions));

app.use("/user", authRouter);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;
connectDB();
app.listen(PORT, () => {
  console.log(`Your server is running at port:${PORT}`);
});
