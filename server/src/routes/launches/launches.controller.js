const {
  getAllLaunches,
  scheduleNewLaunch,
  getLaunchWithFlightNumber,
  abortLaunchByFlightNumber,
} = require("../../models/launches.model.js");

const getPagination = require("../../services/query.js");

async function httpGetAllLaunches(request, response) {
  const { skip, limit } = getPagination(request.query);
  return response.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(request, response) {
  const newLaunch = request.body;
  console.log(newLaunch);
  if (
    !newLaunch.mission ||
    !newLaunch.rocket ||
    !newLaunch.launchDate ||
    !newLaunch.target
  ) {
    return response
      .status(400)
      .json({ error: "One or more required fields for the launch is missing" });
  }
  newLaunch.launchDate = new Date(newLaunch.launchDate);
  if (newLaunch.launchDate.toString() === "Invalid Date") {
    return response.status(400).json({
      error: "Invalid Launch Date",
    });
  }
  await scheduleNewLaunch(newLaunch);
  return response.status(201).json(newLaunch);
}

async function httpAbortLaunchById(request, response) {
  const flightNumber = Number(request.params.id);
  const existsLaunch = await getLaunchWithFlightNumber(flightNumber);
  if (!existsLaunch) {
    return response.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchByFlightNumber(flightNumber);
  if (!aborted) {
    return response.status(400).json({ error: "Launch not aborted" });
  }
  return response.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunchById };
