import request from 'supertest';
import { app } from '../../app';

it('can fetch list of tickets', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title1', price: 10 })
    .expect(201);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title2', price: 20 })
    .expect(201);

  let res2 = await request(app).get(`/api/tickets`).send().expect(200);
  //console.log(res2);
  expect(res2.body.length).toEqual(2);
});
