const db = require("../models");
// const Model = db.Model;
// const { Op } = require("sequelize");
const WebSocket = require('ws');
const axios = require('axios');
const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 9999,
  }
})

redisClient.connect();

redisClient.on('connect', () => {
  console.log('Connected');
});

redisClient.on('error', err => { 
  console.log('Redis Server Error', err);
  process.exit(1);
});

exports.exampleFunction = (req, res) => {
  res.json({ message: "Hello" });
};

exports.refactoreMe1 = async (req, res) => {
  try {
    // fetch data from the database
    const [results] = await db.sequelize.query('SELECT * FROM surveys');
    const data = results.map((result) => result.values);

    const indexes = Array.from(Array(data[0].length), () => []);

    data.forEach((values) => {
      values.forEach((answer, index) => {
        indexes[index].push(answer);
      });
    });

    res.status(200).send({
      statusCode: 200,
      success: true,
      data: indexes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      statusCode: 500,
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.refactoreMe2 = async (req, res) => {
  // function ini untuk menjalakan query sql insert dan mengupdate field "dosurvey" yang ada di table user menjadi true, jika melihat data yang di berikan, salah satu usernnya memiliki dosurvey dengan data false
  try {
    const survey = await Survey.create({
      userId: req.body.userId,
      values: req.body.values, // [] kirim array
    });

    await User.update(
      { dosurvey: true },
      { where: { id: req.body.id } }
    );

    console.log("success");

    res.status(201).send({
      statusCode: 201,
      message: "Survey successfully!",
      success: true,
      data: survey,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      statusCode: 500,
      message: "Cannot post survey.",
      success: false,
    });
  }
};

exports.callmeWebSocket = (req, res) => {
  // WebSocket server
  const wss = new WebSocket.Server({ noServer: true });

  // fetch data from API
  async function fetchData() {
    try {
      const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
      const data = response.data;

      // send the fetched data to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // fetch data every 3 minutes
  function fetchPeriodically() {
    fetchData(); // fetch immediately

    // schedule the next data fetch after 3 minutes
    setTimeout(fetchPeriodically, 3 * 60 * 1000);
  }

  // WebSocket connection handler
  function handleWebSocketConnection(ws) {
    console.log('WebSocket client connected');

    // connected client
    ws.send('Welcome to the WebSocket server!');

    // client closing the connection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  }

  // attach WSS to the HTTP server
  const server = res.socket.server;
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // fetching data every 3 minutes
  fetchPeriodically();

  res.status(200).send('WebSocket server running!');
};

exports.getData = async (req, res) => {
  try {
    // Check the data in Redis cache
    redisClient.get("attackStatistics", async (err, cachedData) => {
      if (cachedData) {
        // Return the cached data
        const data = JSON.parse(cachedData);
        res.status(200).json({
          success: true,
          statusCode: 200,
          data,
        });
      } else {
        // Fetch from API and store in cache
        const response = await axios.get("https://livethreatmap.radware.com/api/map/attacks?limit=10");
        const data = response.data;

        // Store the data into the Redis cache with expiration of 1 hour
        redisClient.setex("attackStatistics", 3600, JSON.stringify(data));

        // Store the data into the database
        await db.sequelize.query(
          `INSERT INTO attacks ("destinationCountry", "sourceCountry", "attackType")
          VALUES ${data
            .map(
              (item) =>
                `('${item.destinationCountry}', '${item.sourceCountry}', '${item.attackType}')`
            )
            .join(", ")}`
        );

        // Retrieve attack statistics from the database
        const result = await db.sequelize.query(`
          SELECT "destinationCountry", COUNT(DISTINCT "attackType") as "totalTypes"
          FROM attacks
          GROUP BY "destinationCountry"
        `);

        // Response
        const label = result[0].map((item) => item.destinationCountry);
        const total = result[0].map((item) => parseInt(item.totalTypes));

        res.status(200).json({
          success: true,
          statusCode: 200,
          data: {
            label,
            total,
          },
        });
      }

      // Close the Redis client
      redisClient.quit();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      error: "Internal Server Error",
    });
  }
};

exports.protectedFunction = (req, res) => {
  // protected route, just for "admin" role
  res.json({
    success: true,
    statusCode: 200,
    message: "Hello Admin",
  });
};