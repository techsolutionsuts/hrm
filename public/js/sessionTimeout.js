function IdleTimeout(timeoutSeconds, options) {
  let defaultsOptions = {
    callback: function () { },
    alertTimeoutSeconds: 300,
    events: "mousemove keydown wheel DOMMouseScroll mousewheel mousedown touchstart touchmove pointerdown pointermove"
  }
  this.timeoutSeconds = timeoutSeconds;
  this.options = Object.assign({}, defaultsOptions, options);
  this.timeoutRef = null;
  this.intervalRef = null;
  this.activityListenerRefs = {};
  this.startTime = null;
  this.endTime = null;

  this.options.events.split(' ').forEach(function (event) {
    this.activityListenerRefs[event] = this.activityListener.bind(this);
    window.addEventListener(event, this.activityListenerRefs[event]);
  }, this);

  this.startTimer();
}

IdleTimeout.prototype.startTimer = function () {
  this.startTime = new Date();
  this.endTime = new Date(this.startTime.getTime()+ (this.timeoutSeconds * 1000))
  this.timeoutRef = setTimeout(this.onTimerDone.bind(this), this.timeoutSeconds * 1000);

  this.intervalRef = setInterval(this.showMessage.bind(this), 1000);
}

IdleTimeout.prototype.clearTimer = function () {
  clearTimeout(this.timeoutRef);
  clearTimeout(this.intervalRef);
  this.hideMessage();
}

IdleTimeout.prototype.resetTimer = function () {
  this.clearTimer();
  this.startTimer()
}

IdleTimeout.prototype.onTimerDone = function () {
  this.options.callback();
  this.options.events.split(' ').forEach(function (event) {
    this.activityListenerRefs[event] = this.activityListener.bind(this);
    window.removeEventListener(event, this.activityListenerRefs[event]);
  }, this);
  clearTimeout(this.intervalRef);
  this.hideMessage();
}

IdleTimeout.prototype.activityListener = function () {
  this.resetTimer();
}

IdleTimeout.prototype.showMessage = function () {
  // console.log('this.endTime.getTime() => ', this.endTime.getTime());
  let remaining = Math.ceil((this.endTime.getTime() - (new Date().getTime())) / 1000);
  // console.log('remaining =>', remaining);
  let min = Math.ceil(remaining/60) - 1;
  min = (min >= 1)?`${min}:${remaining%60} minute(s) remaining to logout....`:`${remaining} seconds(s) remaining to logout....`;
  let message = `${min} `;
  let messageElement = document.querySelector('#timeout-message');
  if (!messageElement) {
    messageElement = document.createElement('span');
    messageElement.setAttribute('id', 'timeout-message');

    if (typeof this.options.customClass === 'string' && this.options.customClass.trm() !== "") {
      messageElement.classList.add(this.options.customClass);
    } else {
      messageElement.style = `
        position: absolute;
        top: 20%;
        left: 50%;
        width: 330px;
        transform: translate(-50%, -50%);
        font-family: 'open Sans', sans-serif;
        padding: 15px;
        border: 2px solid red;
        border-radius: 25px;
        box-shadow: 0px 0px 5px -2px regba(0,0,0,5);
        color: white;
      `
    }
  }
  if (remaining <= this.options.alertTimeoutSeconds) {
    messageElement.style.color = `black`;
    // document.body.appendChild(messageElement);
    $('#sessionOut').modal('show');
  }

  if (remaining <= 60) {
    messageElement.style.color = `red`;
    // document.body.appendChild(messageElement);
    $('#sessionOut').modal('show');
  }
  messageElement.innerHTML = message;
}

IdleTimeout.prototype.hideMessage = function () {
  let messageElement = document.querySelector('#timeout-message');
  if (messageElement) {
    // document.body.removeChild(messageElement);
    $('#sessionOut').modal('hide');
  }
}