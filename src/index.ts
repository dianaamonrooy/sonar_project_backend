import bodyParser from "body-parser";
import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import formServicesController from "./controllers/formServices.controller";
import helmet from "helmet";
import app from "./app";

//For env File 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
