//require http server, and create server with function handler()
var http = require('http').createServer(handler); 

//require filesystem module
var fs = require('fs');

//require socket.io module and pass the http object (server)
var io = require('socket.io')(http) 

//include onoff to interact with the GPIO
var Gpio = require('onoff').Gpio; 

//use GPIO pin 4 as output
var LED2 = new Gpio(18, 'out'); 

//use GPIO pin 4 as output
var LED = new Gpio(27, 'out'); 

//listen to port 8080
http.listen(8080); 

//create server
function handler (req, res) 
{ 
  //read file index.html in public folder
  fs.readFile(__dirname + '/public/index.html', function(err, data) 
  { 
    if (err) 
    {
      //display 404 on error
      res.writeHead(404, {'Content-Type': 'text/html'}); 
      return res.end("404 Not Found");
    }
    //write HTML
    res.writeHead(200, {'Content-Type': 'text/html'}); 

    //write data from index.html
    res.write(data); 
    return res.end();
  });
}

// WebSocket Connection
io.sockets.on('connection', function (socket) 
{
  //static variable for current status
  var lightvalue = 0; 

  //get light switch status from client
  socket.on('light', function(data) 
  { 
    lightvalue = data;

    //only change LED if status has changed
    if (lightvalue != LED.readSync()) 
    { 
      //turn LED on or off
      LED.writeSync(lightvalue); 
    }
  });
  var lightvalue2 = 0;

  //get light switch status from client
  socket.on('light2', function(data) 
  { 
    lightvalue2 = data;

    //only change LED if status has changed
    if (lightvalue2 != LED2.readSync()) 
    { 
      //turn LED on or off
      LED2.writeSync(lightvalue2); 
    }
  });
});

//on ctrl+c
process.on('SIGINT', function () 
{ 
  // Turn LED off
  LED.writeSync(0); 

  // Turn LED off
  LED2.writeSync(0); 

  // Unexport LED GPIO to free resources
  LED.unexport(); 

  // Unexport LED GPIO to free resources
  LED2.unexport(); 

  //exit completely
  process.exit(); 
});
