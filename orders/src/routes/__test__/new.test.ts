import mongoose from 'mongoose';
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();  
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId:ticketId})
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    // Create Mock ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();

    // Create Mock order with the status reserve
    const order = Order.build({
        ticket,
        userId:'asdfasdfd',
        status: OrderStatus.Created,
        expiresAt:new Date()
    })
    await order.save();

    // Send request
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId:ticket.id})
    .expect(400);
});

it('reserves a ticket', async () => {
    // Create Mock ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();

    // Send request
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId:ticket.id})
    .expect(201);
});

it('emit an order created event', async () => {
    // Create Mock ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();

    // Send request
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId:ticket.id})
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});