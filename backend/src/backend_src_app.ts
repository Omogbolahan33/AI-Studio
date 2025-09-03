import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";
import categoryRoutes from "./routes/category";
import chatRoutes from "./routes/chat";
import transactionRoutes from "./routes/transaction";
import disputeRoutes from "./routes/dispute";
import reviewRoutes from "./routes/review";
import notificationRoutes from "./routes/notification";
import activityLogRoutes from "./routes/activityLog";
import bankRoutes from "./routes/bank";
import addressRoutes from "./routes/address";
import uploadRoutes from "./routes/upload";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity", activityLogRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => res.send("AI Studio Backend is running."));

export default app;