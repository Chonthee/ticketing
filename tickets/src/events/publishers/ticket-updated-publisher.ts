import { Publisher, Subjects, TicketUpdatedEvent } from "@kaawtangtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

