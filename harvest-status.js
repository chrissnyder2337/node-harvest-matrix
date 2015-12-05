var config  = require('config'),
    board   = require('rpi-rgb-led-matrix'),
    Harvest = require('harvest'),
    harvest = new Harvest({
      subdomain: config.harvest.subdomain,
      email: config.harvest.email,
      password: config.harvest.password
    }),
    TimeTracking = harvest.TimeTracking,
    Tasks = harvest.Tasks
;

TimeTracking.daily({}, function(err, tasks) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(tasks);
});







board.start(16, 1, true);
board.setPixel(2, 4, 255, 255, 0)
setTimeout(function() {}, 2000);
