import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@kaawtangtickets/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";


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

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

// Not found error should before the error handler
app.all('*',async (req, res)=>{
  throw new NotFoundError();
});

app.use(errorHandler);

export {app};
