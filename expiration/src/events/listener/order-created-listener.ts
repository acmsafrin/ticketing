import { Listener, Subjects, OrderCreatedEvent } from '@acmticket/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queues';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = 'expiration-service';
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expireAt).getTime() - new Date().getTime();
    console.log('Waiting time ' + delay);
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
