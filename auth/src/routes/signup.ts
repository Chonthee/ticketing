import express,{Request,Response} from 'express';
import {body,validationResult} from 'express-validator';
import  jwt  from 'jsonwebtoken';
import { validateRequest,BadRequestError } from '@kaawtangtickets/common';

import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min:4,max:20})
        .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req:Request,res:Response)=>{
        const {email,password} = req.body; 

        // 1. Check existing user
        const existingUser = await User.findOne({email});       
        if(existingUser){
            throw new BadRequestError('Email in use');
        }

        // 2. Hash password
        
        // 3. Create a new User and save to MongoDB
        const user = User.build({email,password});
        await user.save();

        // Generate JWT
        const userJwt = jwt.sign(
            {
              id: user.id,
              email: user.email
            },
            process.env.JWT_KEY!
            // '!' means we alread have check this value and it's exist
          );

        // Store it on session object
        req.session = {
            jwt: userJwt
        };


        // 4. Complete send jwt or something
        res.status(201).send(user);
    }
);

export {router as signupRouter}

