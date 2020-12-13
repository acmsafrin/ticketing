import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';

it('returns 404 if ticket not found', async () => {
  let id = new mongoose.Types.ObjectId().toHexString();
  const res = await request(app).get(`/api/tickets/${id}`).send();

  expect(res.status).toEqual(404);
});

it('returns  ticket if found', async () => {
  let resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 })
    .expect(201);
  //console.log(resp.body.id);

  //const ticket = await Ticket.findById(resp.body.id);
  //console.log(ticket);

  let res2 = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);
  // console.log(res2);
  expect(res2.body.title).toEqual('title');
  expect(res2.body.price).toEqual(10);
});
