import swaggerAutogen from 'swagger-autogen';
import { config } from 'dotenv';

config();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `${process.env.HOST_NAME}:3000`,
};

const outputFile = './swagger-output.json';
const routes = ['./index.ts'];

swaggerAutogen()(outputFile, routes, doc);
