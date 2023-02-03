import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@kaawtangtickets/common";

//import router here
import { createChargeRouter } from "./routes/new";

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

// app use router here
app.use(createChargeRouter);




// Not found error should before the error handler
app.all('*',async (req, res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
