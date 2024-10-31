const Hapi = require("@hapi/hapi");
const HapiReactViews = require("hapi-react-views");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");
const Path = require("path");

require("@babel/register")({
  presets: ["@babel/preset-react", "@babel/preset-env"],
});

const main = async function () {
  const server = Hapi.Server({
    port: 3000,
    host: "localhost",
  });

  await server.register(Vision);
  await server.register(Inert);

  server.views({
    engines: {
      jsx: HapiReactViews,
    },
    compileOptions: {}, // optional
    relativeTo: __dirname,
    path: "views",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.view("index", {
        title: "My React App",
        message: "This message comes from props",
      });
    },
  });

  server.route({
    method: "GET",
    path: "/app/{path*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "client/build/"),
        listing: false,
        index: true,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/static/{path*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "client/build/static/"),
        listing: false,
        index: true,
      },
    },
  });

  await server.start();

  console.log(`Server is listening at ${server.info.uri}`);
};

main();
