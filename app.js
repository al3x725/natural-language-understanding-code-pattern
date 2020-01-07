const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const path = require('path');
const express = require('express');
const app = express();
require('./config/express')(app);

let client;
try {
  client = new NaturalLanguageUnderstandingV1({
    // Remember to place the credentials in the .env file. Read the README.kd file!
    version: '2020-01-01',
  });
} catch (err) {
  console.error('Error creating service client: ', err);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/analyze', async (req, res, next) => {
  try {
    const { result } = await client.analyze(req.body);
    return res.json(result);
  } catch (err) {
    console.error(err);
    if (!client) {
      const error = {
        title: 'Invalid credentials',
        description:
          'Could not find valid credentials for the Natural Language Understanding service.',
        statusCode: 401,
      };
      next(error);
    }
  }
});

// error-handler settings for all other routes
require('./config/error-handler')(app);

module.exports = app;
