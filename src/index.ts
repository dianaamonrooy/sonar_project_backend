import bodyParser from "body-parser";
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import formResponsesService from "./services/formResponses.service";
import formServicesController from "./controllers/formServices.controller";

//For env File 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req: Request, res: Response) => {
    // It sends the status early just to answer the server (this is what a webhook does)
    res.sendStatus(200);
    formServicesController.createNewFormEntry(req)
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});