var React           = require('react');
var HvReactCalendar = require('hv-react-calendar');

var App = React.createClass({

  render: function() {

    var now = new Date();
    var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    var lastMonth = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());

    var dateClasses = [
      {
        date: now,
        classNames: "today"
      },
      {
        date: yesterday,
        classNames: "yesterday"
      },
      {
        date: tomorrow,
        classNames: "tomorrow"
      }
    ];

    return (
      <div>
        <HvReactCalendar />
        <HvReactCalendar startOfWeek="monday" />
        <HvReactCalendar currentDate={lastMonth} />
        <HvReactCalendar locale="fr" />
        <HvReactCalendar forceSixRows={true} />
        <HvReactCalendar dateClasses={dateClasses} />
      </div>
    );

  }

});

React.render(<App />, document.getElementsByTagName('body')[0]);
