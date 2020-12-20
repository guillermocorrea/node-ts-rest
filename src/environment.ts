interface Environment {
  port: number | string;
  mongodbUrl?: string;
  isTestEnvironment: boolean;
}

const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment && !process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL is not set!');
}

export const environment: Environment = {
  port: process.env.PORT || 4100,
  mongodbUrl: process.env.MONGODB_URL,
  isTestEnvironment,
};
