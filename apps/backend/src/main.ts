// apps/backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createServer, Server } from 'http';

// FIX: Use 'import = require' syntax to handle Express module structure correctly
import express = require('express');

import { VercelRequest, VercelResponse } from '@vercel/node';

// Import your main application module
import { AppModule } from './app/app.module';

// --- Configuration ---
const IS_SERVERLESS =
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_ENV === 'preview';
const PORT = process.env.PORT || 3000;
const GLOBAL_PREFIX = 'api';

// --- Serverless Cache ---
let cachedServer: Server;

async function createNestServer(
  expressInstance: express.Express
): Promise<Server> {
  const adapter = new ExpressAdapter(expressInstance);
  const app = await NestFactory.create(AppModule, adapter, {
    // Optional: Disable logs in production/serverless environment
    // logger: IS_SERVERLESS ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Set prefix, which you had working locally
  app.setGlobalPrefix(GLOBAL_PREFIX);

  await app.init();
  return createServer(expressInstance);
}

// ---------------------------------------------
// 🌟 1. SERVERLESS HANDLER (For Vercel)
// ---------------------------------------------
async function bootstrapServerlessHandler(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    cachedServer = await createNestServer(expressApp);
  }
  return cachedServer;
}

// Export the Vercel handler function
export default async function (req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServerlessHandler();
  // Pass the request to the cached server instance
  server.emit('request', req, res);
}

// ---------------------------------------------
// 🌟 2. LOCAL STARTUP (For nx serve backend)
// ---------------------------------------------
if (!IS_SERVERLESS) {
  async function bootstrapLocal() {
    // Note: Since nx serve uses its own runner, you might revert to the simple
    // NestFactory.create() and app.listen() call here for standard dev experience.
    // For now, let's use the explicit server start method:

    const expressApp = express();
    const server = await createNestServer(expressApp);

    server.listen(PORT, () => {
      console.log(
        `\n\n🚀 Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`
      );
    });
  }
  bootstrapLocal();
}
