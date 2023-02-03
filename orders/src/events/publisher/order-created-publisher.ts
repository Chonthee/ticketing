import { Publisher, OrderCreatedEvent, Subjects} from "@kaawtangtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
}