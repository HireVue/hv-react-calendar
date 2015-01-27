var React           = require('react');
var HvReactCalendar = require('hv-react-calendar');

var App = React.createClass({
  render: function() {
    return (
      <HvReactCalendar />
    );
  }
});

React.render(<App />, document.getElementsByTagName('body')[0]);
