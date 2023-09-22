const express = require("express");
const mongoose = require("mongoose");
const Rooms = require("./dbRooms");
const dotenv = require("dotenv").config();
const cors = require("cors");
const Messages = require("./dbMessages");
const app = express();

const Pusher = require("pusher");
const Query = require("./createQuery");

app.use(express.json());
app.use(cors("*"));

// pusher configuration
const pusher = new Pusher({
  appId: "1672355",
  key: "03e663ec229c6ffbcfe7",
  secret: "b0fe7376fa493e09c0c5",
  cluster: "ap2",
  useTLS: true,
});

const dbUrl = process.env.DB;
// db connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
// connection open
db.once("open", () => {
  console.log("Db connected");

  const roomCollection = db.collection("rooms");
  const changeStream = roomCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const roomDetails = change.fullDocument;
      pusher.trigger("room", "inserted", roomDetails);
    } else {
      console.log("not expected event to trigger");
    }
  });
  const msgCollection = db.collection("messages");
  const changeStreams = msgCollection.watch();

  changeStreams.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const msgDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", msgDetails);
    } else {
      console.log("not expected event to trigger");
    }
  });
});

app.get("/", (req, res) => {
  res.send("hello world!");
});

// create a group

app.post("/group/create", async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const data = await Rooms.create({ groupName });
    res.status(201).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/messages/new", async (req, res) => {
  try {
    const { name, message, uid, roomId } = req.body;
    const data = await Messages.create({ name, message, uid, roomId });
    res.status(201).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/all/rooms", async (req, res) => {
  try {
    // Use Room.find() to fetch all rooms from the database
    const findAllRooms = await Rooms.find();

    // Handle the case where no rooms are found
    if (!findAllRooms || findAllRooms.length === 0) {
      return res.status(404).json({ error: "No rooms found." });
    }

    // Send a JSON response with a 200 status code
    res.status(200).json(findAllRooms);
  } catch (error) {
    console.error(error);
    // Handle errors by sending a 500 status code and an error message
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/room/:id", async (req, res) => {
  try {
    // Use Room.find() to fetch all rooms from the database
    const findRoom = await Rooms.find({ _id: req.params.id });

    // Handle the case where no rooms are found
    if (!findRoom || findRoom.length === 0) {
      return res.status(404).json({ error: "No rooms found." });
    }

    // Send a JSON response with a 200 status code
    res.status(200).json(findRoom[0]);
  } catch (error) {
    console.error(error);
    // Handle errors by sending a 500 status code and an error message
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/messages/:id", async (req, res) => {
  try {
    // Use Room.find() to fetch all rooms from the database
    const findRoom = await Messages.find({ roomId: req.params.id });
    if (findRoom) {
      res.status(200).send(findRoom);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/create-query", async (req, res) => {
  try {
    const { category, language, title, details, dateFrom, till } = req.body;

    const newQuery = await Query.create({
      category,
      language,
      title,
      details,
      dateFrom,
      till,
    });

    // Save the new query document to the database
    const savedQuery = await newQuery.save();

    res.status(201).json(savedQuery);
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/all/queries", async (req, res) => {
  try {
    // Use Room.find() to fetch all rooms from the database
    const findAllQuery = await Query.find();

    // Handle the case where no rooms are found
    if (!findAllQuery || findAllQuery.length === 0) {
      return res.status(404).json({ error: "No Query found." });
    }

    // Send a JSON response with a 200 status code
    res.status(200).json(findAllQuery);
  } catch (error) {
    console.error(error);
    // Handle errors by sending a 500 status code and an error message
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001);
