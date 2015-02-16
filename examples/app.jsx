var React           = require('react');
var HvReactCalendar = require('hv-react-calendar');

var App = React.createClass({

  render: function() {

    var now = new Date();
    var yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    var lastMonth = new Date(now.getFullYear(), now.getMonth()-1, now.getDate());
    var firstDayNextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);

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
      },
      {
        date: firstDayNextMonth,
        classNames: "dayOne"
      }
    ];

    function onDateSelect(date) {
      console.log('You clicked on: ', date);
    }

    function onMonthChange(date) {
      console.log('You changed to this month: ', date);
    }

    return (
      <div>
        <HvReactCalendar />
        <HvReactCalendar currentDate={lastMonth} />
        <HvReactCalendar locale="fr" />
        <HvReactCalendar forceSixRows={true} />
        <HvReactCalendar dateClasses={dateClasses} />
        <HvReactCalendar onDateSelect={onDateSelect} />
        <HvReactCalendar currentDate={lastMonth} disablePast={true} />
        <HvReactCalendar onMonthChange={onMonthChange} />
      </div>
    );

  }

});

React.render(<App />, document.getElementsByTagName('body')[0]);
