import {Subjects, Publisher, ExpirationCompleteEvent}from '@kaawtangtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}