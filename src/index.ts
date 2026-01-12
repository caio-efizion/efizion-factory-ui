import Fastify from 'fastify';

const app = Fastify();

app.get('/health', async () => ({ status: 'ok' }));

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('Server listening on', address);
});
