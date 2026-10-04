import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export const connectDB = async () => {
  const candidateUris = [
    process.env.MONGO_URI,
    'mongodb://127.0.0.1:27017/portfolio-dashboard'
  ].filter(Boolean);

  let lastError = null;

  for (const uri of candidateUris) {
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB connected using: ${uri}`);
      return;
    } catch (error) {
      lastError = error;
      const message = error?.message || '';
      const shouldFallback = /ENOTFOUND|ECONNREFUSED|querySrv|MongooseServerSelectionError|MongoServerSelectionError/i.test(message) || error?.code === 'ENOTFOUND';
      if (!shouldFallback) {
        break;
      }
    }
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB connected using in-memory MongoDB server');
  } catch (memoryError) {
    console.error('MongoDB connection failed:', lastError || memoryError);
    console.error('In-memory MongoDB fallback failed:', memoryError);
    throw memoryError;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
