const { getAllPlanets } = require("../../models/planets.model.js");

async function httpGetAllPlanets(request, response) {
  return response.status(200).json(await getAllPlanets());
}

module.exports = { httpGetAllPlanets };
