require("dotenv").config();
const http = require("http");

const app = require("./app.js");
const { mongoConnect } = require("./services/mongo.js");

const { loadPlanetsData } = require("./models/planets.model.js");
const { loadLaunchData } = require("./models/launches.model.js");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
