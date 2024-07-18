import express from "express"
import cors from "cors"
import 'dotenv/config.js'
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import noteRouter from "./routes/noteRouter.js"


const app = express();
const port = process.env.PORT;

//middleware
app.use(express.json())
app.use(cors())


//DB connection
connectDB();

//Api endpoints

app.use("/api/user", userRouter)
app.use('/api/note', noteRouter)

app.get('/',(req,res) => {
    res.send("Api working")
})

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
})