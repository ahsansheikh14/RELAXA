import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import { ensureBootstrapAdmin } from './services/adminBootstrap.service.js';

const startServer = async () => {
  try {
    await connectDB(env.mongoUri);
    await ensureBootstrapAdmin();

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
