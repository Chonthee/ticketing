import { Publisher, OrderCancelledEvent, Subjects} from "@kaawtangtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}