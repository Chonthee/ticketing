import { Publisher, Subjects, TicketCreatedEvent } from "@kaawtangtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    
}