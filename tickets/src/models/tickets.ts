import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttr {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttr): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId: string;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static('build', (attrs: TicketAttr) => {
  return new Ticket(attrs);
});

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
