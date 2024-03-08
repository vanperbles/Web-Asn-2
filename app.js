// Import required modules
var express = require('express');
var path = require('path');
var app = express();
const exphbs = require('express-handlebars');
const fs = require('fs'); // Import the 'fs' module
const bodyParser = require('body-parser');

// Set the port for the application
const port = process.env.PORT || 3000;

// Read the JSON data from the file
const filePath = path.join(__dirname, 'datasetB.json');
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));


// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Middleware for parsing the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// Register a custom Handlebars helper
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
      // Custom helper to replace "0" with "N/A" and apply a class for highlighting
      displayReviews: function(reviews) {
          if (reviews === "0") {
              return new exphbs.SafeString('<span class="highlight">N/A</span>');
          } else {
              return reviews;
          }
      }
  }
});

// Register the Handlebars engine with Express
app.engine('hbs', hbs.engine);

// Set the default view engine to Handlebars
app.set('view engine', 'hbs');

// Define a route for the root path ('/')
app.get('/', function(req, res) {
  // Render the 'partials/index.hbs' template with the provided data
  res.render('index', { title: 'Express' });
});

// Route for loading the attached JSON file
app.get('/data', function (req, res) {
  // Use path.join to create the correct file path
  const filePath = path.join(__dirname, 'datasetB.json');

  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          // Handle potential errors, such as the file not existing
          res.status(500).send('Internal Server Error');
          return;
      }

      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Render the Handlebars template with the JSON data
      res.render('data', { jsonContent: JSON.stringify(jsonData, null, 2) });
  });
});



// New route for loading JSON data and displaying a message
app.get('/loadData', (req, res) => {
  const filePath = path.join(__dirname, 'datasetB.json');

  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Internal Server Error');
      } else {
          // Log the entire JSON data to the console
          console.log('Entire JSON data:', data);

          // Send the message as a response
          res.send('JSON data is loaded and ready!');
      }
  });
});


app.get('/data/product/:index', (req, res) => {
  const index = req.params.index;
  const product = jsonData[index];

  // Render the Handlebars template with product data
  res.render('productIndex', { product });
});




// Show page with a form
app.get('/data/search/prdID/', (req, res) => {
  res.render('search');
});

// New route for handling product search by product_id
app.post('/data/search/prdID', (req, res) => {
  const productId = req.body.product_id;

  if (!productId) {
    res.status(400).send('Product ID is required');
    return;
  }

  const foundProduct = jsonData.find(product => product.asin === productId);

  // Render the search result using the Handlebars template
  res.render('search', { result: foundProduct, productId });
});





// Show page with a form for product_name search
app.get('/data/search/prdName', (req, res) => {
  res.render('searchResult');
});




app.post('/data/search/prdName', (req, res) => {
  const partialProductName = req.body.product_name;

  if (!partialProductName) {
      res.status(400).send('Partial Product Name is required');
      return;
  }

  const matchingProducts = jsonData.filter(product => product.title.toLowerCase().includes(partialProductName.toLowerCase()));

  if (matchingProducts.length > 0) {
      // Displaying the minimum of three fields (category, actual_price, rating)
      const result = matchingProducts.map(product => ({
          category: product.categoryName,
          actual_price: product.price,
          rating: product.stars,
          title: product.title
      }));

      // Render the search result using the Handlebars template
      res.render('searchResult', { result });
  } else {
      res.status(404).send('No matching products found');
  }
});


// Route to display all books data in an HTML table
app.get('/allData', (req, res) => {
  // Assuming jsonData contains books information
 
  const books = jsonData.map(book => ({
    ...book,
    isZeroReviews: book.reviews === "0"
}));

  // Render the 'allData' template with the books data
  res.render('allData', { books });
});





// Define a route for the '/users' path
app.get('/users', function(req, res) {
  // Send a simple response for the '/users' route
  res.send('respond with a resource');
});

// Define a wildcard route to handle any other paths
app.get('*', function(req, res) {
  // Render the 'partials/error.hbs' template with the provided data for any other routes
  res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
});

// Start the Express application and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});





 
/******************************************************************************
* ITE5315 – Assignment 2
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: ____Sarfo George Arhin_______________ Student ID: __N01635265_____________ Date: _______3/5/2024_____________
*
*
******************************************************************************/ 