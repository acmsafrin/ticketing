import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
  PaymentCreatedEvent,
} from '@acmticket/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
