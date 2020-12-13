import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@acmticket/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../model/orders';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = 'payment-service';
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error('No order found');
    }
    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
