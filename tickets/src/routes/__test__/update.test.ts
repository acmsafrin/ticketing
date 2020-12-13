import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';

jest.mock('../../nats-wrapper');

it('return 404 if the provided id doesnt exist', async () => {
  let id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdasd',
      price: 20,
    })
    .expect(404);
});

it('return 401 if the user authenticate', async () => {
  let id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'sdasd',
      price: 20,
    })
    .expect(401);
});

it('return 401 if doesnt own the ticket', async () => {
  let res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'sdasd',
      price: 20,
    })
    .expect(401);
});

it('return 400 if user provides invalid tittle or price', async () => {
  let cookie = global.signin();
  let res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'fsdf',
      price: -20,
    })
    .expect(400);
});

it('update the tickets provided correct values', async () => {
  let cookie = global.signin();
  let res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 20,
    })
    .expect(200);

  let res2 = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);
  // console.log(res2);
  expect(res2.body.title).toEqual('title2');
  expect(res2.body.price).toEqual(20);
});

it('reject updates if the ticket is reserved', async () => {
  let cookie = global.signin();
  let res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 })
    .expect(201);

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title2',
      price: 20,
    })
    .expect(400);
});
