import mongoose from 'mongoose';
import express, { Request, Response} from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@kaawtangtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // Can save to database, env or anything

router.post('/api/orders',requireAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //to make sure the imcoming value is generate from mongodb
        .withMessage('TicketId must be provided')
], 
    validateRequest,
    async (req:Request, res: Response) => {
        const {ticketId} = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        // Run query to look at all ordr. Find an order where the ticket
        // is the ticket we just found *and* the orders status is *not* cancelled.
        // If we find an order from that means the ticket *is* reserved
        const isReserved = await ticket.isReserved();
        if(isReserved){
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate an expiration date fot this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds()+ EXPIRATION_WINDOW_SECONDS);

        // Build the order and save tit to the database
        const order = Order.build({
            userId: req.currentUser!.id, // Dont worry about currentUser we already check at middleware
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save();
        
        // Publish and event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id:ticket.id,
                price:ticket.price
            }
        });
        res.status(201).send(order);
    }
); 

export {router as newOrderRouter};