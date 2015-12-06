var Canvas = require('canvas'),
board = require('rpi-rgb-led-matrix');

const STATE_STOPPED       = 0;
const STATE_STARTED       = 1;
const STATE_NO_TASK       = 2;
const STATE_TASK_RUNNING  = 3;


var display = module.exports = {
  state: STATE_STOPPED,
  projectCode: '',
  taskHours: 0.0,
  width: 32,
  height: 16,
  update: true,
  start: function() {
    board.start(16, 1, true);
    this.state = STATE_STARTED;
  },
  stop: function() {
    board.stop();
    this.state = STATE_STOPPED;
  },
  run: function() {
    var width = 32, height = 16;
    if (!this.update){
      return;
    }
    this.update = false;
    switch (this.state) {
      case STATE_NO_TASK:
        //board.fill(0, 100, 0);
        var canvas = new Canvas(width, height)
        var ctx = canvas.getContext('2d');

        // Verdana looks decent at low resolutions
        ctx.font = "8px SquareDance10";

        setInterval(function() {
          var now = new Date()
          var minutes = now.getMinutes().toString()
          var seconds = now.getSeconds().toString()
          if (minutes.length === 1) minutes = '0' + minutes
          if (seconds.length === 1) seconds = '0' + seconds
          var str = '' + minutes + ':' + seconds

          ctx.fillStyle = "black"
          ctx.fillRect(0, 0, 32, 16)

          ctx.fillStyle = "#FFFFFF"
          ctx.fillText(str, 0, 5)

          board.drawCanvas(ctx, width, height)

        }, 1000)
        break;
          case STATE_TASK_RUNNING:
          var canvas = new Canvas(width, height)
          var ctx = canvas.getContext('2d');

          var client = this.projectCode.split("-")[0].trim();
          // Verdana looks decent at low resolutions
          ctx.font = "7px SquareDance10";
          ctx.fillStyle = "black"
          ctx.fillRect(0, 0, 32, 16)
          ctx.fillStyle = "#00FF70"
          ctx.fillText(client, 5, 9)
          board.drawCanvas(ctx, width, height)
        break;
      default:
        var canvas = new Canvas(width, height)
        var ctx = canvas.getContext('2d');

        // Verdana looks decent at low resolutions
        ctx.font = '8px "PixelSix14"';
        ctx.font = '8px "DejaVu Sans Monos"';

        var str = 'LOADING...'

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, 32, 16)
        ctx.fillStyle = "#00FF70"
        ctx.fillText(str, 0, 10)
        board.drawCanvas(ctx, width, height)
    }
  },
  noTaskRunning: function() {
    this.state = STATE_NO_TASK;
  },
  taskRunning: function(projectCode, taskHours) {
    if (this.state == STATE_TASK_RUNNING
      && this.projectCode == projectCode
      && this.taskHours == taskHours) {
        return;
      }
    this.projectCode = projectCode;
    this.taskHours = taskHours;
    this.state = STATE_TASK_RUNNING
    this.update = true;
  }
}
