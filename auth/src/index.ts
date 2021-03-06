import mongoose from 'mongoose';
import { app } from './app';
const start = async () => {
  console.log('Auth App starting Up..')
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongo');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Auth Listening test 1!!!: ' + 3000);
  });
};

start();
