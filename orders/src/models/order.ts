import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@kaawtangtickets/common';
import { TicketDoc } from './ticket';

export {OrderStatus};

interface OrderAttrs{
    userId:string;
    status:OrderStatus;
    expiresAt: Date;
    ticket:TicketDoc; //reference to another collection
}

interface OrderDoc extends mongoose.Document{
    userId:string;
    status:OrderStatus;
    expiresAt: Date;
    ticket:TicketDoc; //reference to another collection
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId:{
        type: String, //Type of mongoose javascript
        required:true
    },
    status: {
        type: String,
        required:true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type:mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Ticket'
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id,
            delete ret._id
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs:OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order};