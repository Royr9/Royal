// jshint esversion:6

// modules requiering
const express = require("express");
const https = require("https");

const app = express();

// instead of body-parser
app.use(express.urlencoded());


// uploading our static files
app.use(express.static("public"));

// get to our website
app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

// after user signs up
app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName
    }
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us11.api.mailchimp.com/3.0/lists/ee78080e31/members";
  const options = {
    method: "POST",
    auth: "ceren:6a2ea62ab5725927543af80b16575ff0-us11"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
      const statusCode = response.statusCode;
      console.log(statusCode);
      if (statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
  });

  app.post("/failure", function(req, res){
    res.redirect("/");
  });

  request.write(jsonData);
  request.end();

// https.get(url, function(response){
//
// });

});




// our servers port
app.listen(process.env.PORT || 3000, function(){
  console.log("Server has started on port 3000");
});



// mailChimp api key:
// const mailChimpApiKey = "6a2ea62ab5725927543af80b16575ff0-us11";

// audience/list // ID
// ee78080e31

// mailchimp list url to post new object into the list:
// https://usx.api.mailchimp.com/3.0/lists
