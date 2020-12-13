import {
  currentUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@acmticket/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets';

let router = express.Router();

router.get('/api/tickets/', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
