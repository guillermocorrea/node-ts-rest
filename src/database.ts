import { environment } from './environment';
import mongoose from 'mongoose';

export async function connect() {
  if (environment.mongodbUrl && !environment.isTestEnvironment) {
    try {
      await mongoose.connect(environment.mongodbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB Connected!');
    } catch (err) {
      console.error('Error connecting to MongoDB', err);
    }
  }
}
connect();
