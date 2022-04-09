/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: 'TEST_TASK',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  db: {
    url: 'mongodb+srv://sonirathore:Tester123@clusterfree.igqb2.mongodb.net/nestjs?retryWrites=true&w=majority'
  },
};
