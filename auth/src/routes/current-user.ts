import express from 'express';

//import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '@kaawtangtickets/common';

const router = express.Router();

router.get('/api/users/currentuser',currentUser,/*requireAuth,*/(req,res)=>{
    res.send({currentUser: req.currentUser||null});
});

export {router as currentUserRouter}
