import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { emailQueue } from './queues/email.queue.js';

// 1. Initialize the Express Adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// 2. Initialize Bull Board and attach your queues
createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    // Add other queues here in the future
  ],
  serverAdapter: serverAdapter,
});

// 3. Export the router so `app.ts` can mount it
export const bullBoardRouter = serverAdapter.getRouter();
