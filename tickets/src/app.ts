import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@kaawtangtickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";


const app = express();
app.set('trust proxy', true); // to tell express trust proxy of ingress
app.use(express.json());
app.use(
  cookieSession({
    signed:false,
    secure:process.env.NODE_ENV !== 'test' //https
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// Not found error should before the error handler
app.all('*',async (req, res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
