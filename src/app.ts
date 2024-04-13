import bodyParser from "body-parser";
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import formServicesController from "./controllers/formServices.controller";
import helmet from "helmet";

//For env File 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req: Request, res: Response) => {
    // It sends the status early just to answer the server (this is what a webhook does)
    res.sendStatus(200);
    formServicesController.createNewFormEntry(req)
});

export default app
