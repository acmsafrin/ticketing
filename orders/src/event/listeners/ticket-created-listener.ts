import { Listener, Subjects, TicketCreatedEvent } from '@acmticket/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/tickets';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'orders-service';
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const ticket = Ticket.build({
      price: data.price,
      title: data.title,
      id: data.id,
    });
    await ticket.save();

    msg.ack();
  }
}
