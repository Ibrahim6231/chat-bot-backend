import express from "express";
import { config } from "dotenv";
import mongoose from 'mongoose';
import cors from 'cors';
import { api } from "./routes/api";
import { envConfig } from "./config/config";
import { inviteUsersHelper } from "./routes/admin/helper";

config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8001;


app.get("/test", (req, res) => {
    return res.send("<h1> test success: Get API running </h1>")
});

app.use('/api', api);

app.get('*', (req, res) => {
    return res.status(404).send("<h1> Server Response: Url Not Found </h1>");
});


{
    let PATH = process.env.DB_PATH || 'mongodb://localhost:27017/boilerplate';
    if (PATH.includes("password")) {
        PATH = PATH.replace("password", envConfig.KEY_M);
    }
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.connect(PATH);
    console.log({PATH})

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db connection error:'));
    db.once('open', () => console.info('connected to db'));
}

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`)
})