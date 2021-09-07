(function () {
  const userui = document.getElementById('userui').value;
  const timeoutsecond = document.getElementById('timeoutsecond').value;
  // console.log('Userui => ', userui);
  const timeoutSeconds = (timeoutsecond !== "") ? +timeoutsecond * 60 : 60 * 60;
        // console.log('Timeout @...', timeoutSeconds, 'seconds');
    let timer = new IdleTimeout(timeoutSeconds, {
      callback: function () {
        // console.log('Session timeout...', timeoutSeconds);
        if (userui !== "") {
          let autoLogout = getSubmit('/timeout/' + userui, 'GET');
          autoLogout.done(function (response) {
            window.location.replace('/timeout');
          });
          }
        else {
          window.location.replace('/timeout');
        }
      }
    })
  
})();