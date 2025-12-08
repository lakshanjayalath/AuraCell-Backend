import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import cors from "cors";
import dotenv from "dotenv";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(
    (req, res, next) => {
        let token = req.header("Authorization")
        if (token != null) {
            token = token.replace("Bearer ", "")
            jwt.verify(token, process.env.JWT_SECRET,
                (err, decoded) => {
                    if (decoded == null) {
                        res.json({
                            message: "Invalid token please login again"
                        })
                        return
                    }else{
                        req.user = decoded
                    }
                }
            )
        }
        next();
    }
)

const connectionString = process.env.MONGODB_URI


mongoose.connect(connectionString).then(
    () => {
        console.log("Database connected")
    }
).catch(
    () => {
        console.log("Database connection failed")
    }
)



app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)


app.listen(5000,
    () => {
        console.log("Server is running on PORT:5000")
    }
)