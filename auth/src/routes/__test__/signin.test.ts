import request from 'supertest';
import { app } from '../../app';

it('failed when email doesnt exist supply', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'est@c.com',
      password: 'password',
    })
    .expect(400);
});

it('failed when incorrect password supply', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'est@c.com',
      password: 'password',
    })
    .expect(400);
});

it('reponds with cookie when valid credential given', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(201);
  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
