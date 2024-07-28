const express = require("express");
const database = require("../connect");
const eventsRoutes = express.Router();

//getAllEvents
eventsRoutes.route("/events").get(async (request, response) => {
  let db = await database.getDb();
  let data = await db.collection("Events").find({}).toArray();

  if (data.length > 0) {
    response.json(data);
  } else {
    throw new Error("Data was not found.");
  }
});

//createNewEvent
eventsRoutes.route("/events").post(async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    date: request.body.date,
    location: request.body.location,
    info: request.body.info,
  };
  let data = await db.collection("Events").insertOne(mongoObject);

  response.json(data);
});

//deleteEvent
eventsRoutes.route("/events/:id").delete(async (request, response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

  module.exports = eventsRoutes