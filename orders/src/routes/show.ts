import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@acmticket/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/orders';

let router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findOne({
      _id: req.params.orderId,
    }).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
