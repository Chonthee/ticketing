import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?:string) => string[];
  }

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY ="sk_test_51MW0zdALNdAMK3nTUyOSg9YWuuujjacvQD9POLEC53IHkwj9G3qgOEAd4zaYH4NwieKKPN4KVcz6qmtrgJr96Ivw00u36fEzCD"

let mongo:any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdfdsa'

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
  
    await mongoose.connect(mongoUri
    // ,{
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    // }
    )
  });
  
beforeEach(async ()=>{
    jest.clearAllMocks();

    // Delete all collection in mongo-inmem
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close()
})


global.signin =  (id?: string)=>{
    // Build a JWT payload.  { id, email }
    const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    };

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string thats with the encoded cookie
    return [`session=${base64}`];
}