import { Ticket } from '../tickets';

it('impleements optimistinc concurrency contrl', async (d) => {
  const tick = Ticket.build({
    price: 10,
    title: 'test',
    userId: 'fsdfsd',
  });

  await tick.save();

  const fstTick = await Ticket.findById(tick.id);
  const secTick = await Ticket.findById(tick.id);

  fstTick!.set({ price: 20 });
  secTick!.set({ price: 30 });

  await fstTick!.save();
  try {
    await secTick!.save();
  } catch (e) {
    d();
    return;
  }

  throw new Error('SHoud not');
});

it('check versioning', async () => {
  const tick = Ticket.build({
    price: 10,
    title: 'test',
    userId: 'fsdfsd',
  });

  await tick.save();
  expect(tick.version).toEqual(0);
  await tick.save();
  expect(tick.version).toEqual(1);
  await tick.save();
  expect(tick.version).toEqual(2);
  await tick.save();
  expect(tick.version).toEqual(3);
});
