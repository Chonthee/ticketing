import express from "express";
import 'express-async-errors';
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler,NotFoundError } from "@kaawtangtickets/common";

const app = express();
app.set('trust proxy', true); // to tell express trust proxy of ingress
app.use(express.json());
app.use(
  cookieSession({
    signed:false,
    secure:process.env.NODE_ENV !== 'test' //https
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Not found error should before the error handler
app.all('*',async (req, res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
