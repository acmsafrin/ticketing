import request from 'supertest';
import { app } from '../../app';
it('expected 201', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'est@c.com',
      password: 'password',
    })
    .expect(201);
});

it('expected 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'estc.com',
      password: 'password',
    })
    .expect(400);
});

it('expected 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'estc@c.com',
      password: 'pad',
    })
    .expect(400);
});

it('expected 400 with missing email & password', async () => {
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('dissallow duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(400);
});

it('sets a cookie after succusfull signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '12345',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
