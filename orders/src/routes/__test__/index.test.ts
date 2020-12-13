import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/orders';

it('fetches orders for a particular user', async () => {
  const ticket = Ticket.build({
    price: 20,
    title: 'aaaaa',
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const ticket2 = Ticket.build({
    price: 20,
    title: 'bbbbb',
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket2.save();

  const ticket3 = Ticket.build({
    price: 20,
    title: 'ccccc',
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket3.save();

  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  //console.log(res1.body);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send({});

  expect(res.body.length).toEqual(2);
});
