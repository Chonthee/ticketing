import mongoose from "mongoose";
import { app } from "./app";

const start = async () =>{
  // Check process env
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defiend');
  }

  // Connect to MongoDB
  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined')
  }
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  }
  catch(err){
    console.log(err);
  }

  // Listening on port 
  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!");
  });  
};

start();

