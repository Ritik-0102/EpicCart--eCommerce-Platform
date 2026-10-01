const express = require('express');

// Initialize the Express application
const app = express();

// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// Create a simple GET route at the root URL ('/')
app.get('/', (req, res) => {
  res.send('Welcome to the EpicCart API');
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
