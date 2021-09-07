$(document).ready(function() {
    let AutoLogout = (function() {
        function AutoLogout() {
            this.events = ['load', 'mousemove', 'mousedown',
                'click', 'scroll', 'keypress'
            ];

            this.warn = this.warn.bind(this);
            this.logout = this.logout.bind(this);
            this.resetTimeout = this.resetTimeout.bind(this);

            let self = this;
            this.events.forEach(function(event) {
                window.addEventListener(event, self.resetTimeout);
            });

            this.setTimeout();
        }

        let _p = AutoLogout.prototype;

        _p.clearTimeout = function() {
            if (this.warnTimeout)
                clearTimeout(this.warnTimeout);

            if (this.logoutTimeout)
                clearTimeout(this.logoutTimeout);
        };

        _p.setTimeout = function() {
            this.warnTimeout = setTimeout(this.warn, 1 * 60 * 1000);

            this.logoutTimeout = setTimeout(this.logout, 1 * 60 * 1000);
        };

        _p.resetTimeout = function() {
            this.clearTimeout();
            this.setTimeout();
        };

        _p.warn = function() {
            alert('You will be logged out automatically in 1 minute.');
        };

        _p.logout = function() {
            // Send a logout request to the API
            console.log('Sending a logout request to the API...');

            this.destroy(); // Cleanup
        };

        _p.destroy = function() {
            this.clearTimeout();

            let self = this;
            this.forEach(function(event) {
                window.removeEventListener(event, self.resetTimeout);
            });
        };

        return AutoLogout;
    })();
});