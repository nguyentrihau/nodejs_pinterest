const rootRoute = require("./routers/rootRoute");

const server = require("fastify")({
  logger: true,
});

(async () => {
  try {
    server.listen({ port: 8080 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
})();

server.register(rootRoute, { prefix: "/api" });
