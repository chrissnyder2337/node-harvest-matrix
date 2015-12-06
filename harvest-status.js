var display = require('./status-display'),
    config  = require('config'),
    Harvest = require('harvest'),
    harvest = new Harvest({
      subdomain: config.harvest.subdomain,
      email: config.harvest.email,
      password: config.harvest.password
    }),
    TimeTracking = harvest.TimeTracking,
    Projects = harvest.Projects,
    projects = undefined
;

display.start();
display.run();

Projects.list({}, function(err, projectList) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  projects = {};
  for (var i = 0, len = projectList.length; i < len; i++) {
    projects[projectList[i].project.id] = projectList[i].project;
  }

  setInterval(function() {
    TimeTracking.daily({}, function(err, tasks) {
       if (err) {
         console.log(err.message);
         display.stop();
         process.exit(1);
       }
       var runningTask = undefined;

       for (var i = 0, len = tasks.day_entries.length; i < len; i++) {
         if (tasks.day_entries[i].hasOwnProperty("timer_started_at")) {
           runningTask = tasks.day_entries[i];
           break;
         }
       }

       if (runningTask !== undefined) {
         display.taskRunning(projects[runningTask.project_id].code,runningTask.hours );
         display.run();
       } else {
         display.noTaskRunning();
         display.run();
       }


       console.log(runningTask);
     });
  }, 1000)


});








// display.start();
//
// display.run();
//
//
// display.noTaskRunning();
//
//
//
//   display.taskRunning('CODE', 1.5);
//
//   sleep(5000);
//
//
//   display.noTaskRunning();
//
//   sleep(2000);
//
//
//   display.taskRunning('CODE', 1.5);
//
//     sleep(5000);



//
//
// board.start(16, 1, true);
// board.setPixel(2, 4, 255, 255, 0)
// setTimeout(function() {}, 2000);
