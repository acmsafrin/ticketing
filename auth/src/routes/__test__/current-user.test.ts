import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('response with detail about current user', async () => {
  const cookie = await global.signin();
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual('test@test.com');
});
