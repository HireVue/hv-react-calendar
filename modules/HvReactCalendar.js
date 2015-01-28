var moment    = require('moment');
var React     = require('react');
var PropTypes = React.PropTypes;


var HvReactCalendar = React.createClass({

  propTypes: {
    locale       : PropTypes.string,
    startOfWeek  : PropTypes.oneOf(['sunday','monday']).isRequired,
    currentDate  : PropTypes.instanceOf(Date),
    forceSixRows : PropTypes.bool,
    dateClasses  : PropTypes.arrayOf(PropTypes.shape({
      date       : PropTypes.instanceOf(Date),
      classNames : PropTypes.string
    }))
  },

  getDefaultProps: function() {
    return {
      locale       : 'en',
      startOfWeek  : 'sunday',
      forceSixRows : false
    }
  },

  getInitialState: function() {
    return {
      date: moment()
    }
  },

  componentWillMount: function() {
    if (this.props.currentDate) {
      this.setState({date: moment(this.props.currentDate)});
    }
  },

  nextMonth: function() {
    this.setState({date: this.state.date.add(1, 'months')});
  },

  prevMonth: function() {
    this.setState({date: this.state.date.subtract(1, 'months')});
  },

  getMonthName: function() {
    moment.locale(this.props.locale);
    return moment.months()[this.state.date.get('month')] + ' ' + this.state.date.get('year');
  },

  /* make the days of the week */
  getDaysOfTheWeek: function() {
    moment.locale(this.props.locale);
    var weekdays = moment.weekdaysShort();
    if (this.props.startOfWeek === 'monday') {
      weekdays.push(weekdays.shift());
    }
    return weekdays;
  },

  /* make the days of the month */
  getDays: function() {
    var days = [];
    var date = this.state.date.startOf('month');
    var diff = date.weekday();
    if (this.props.startOfWeek === 'monday') {
      diff -= 1;
    }
    if (diff < 0) diff += 7;

    var i;
    for (var i = 0; i < diff; i++) {
      var day = moment([this.state.date.year(), this.state.date.month(), i-diff+1])
      days.push({day: day, classes: 'prev-month'});
    }

    var numberOfDays = date.daysInMonth();
    for (i = 1; i <= numberOfDays; i++) {
      var day = moment([this.state.date.year(), this.state.date.month(), i]);
      days.push({day: day});
    }

    i = 1;
    while (days.length % 7 !== 0) {
      var day = moment([this.state.date.year(), this.state.date.month(), numberOfDays+i]);
      days.push({day: day, classes: 'next-month'});
      i++;
    }

    if (this.props.forceSixRows && days.length !== 42) {
      var start = moment(days[days.length-1].day).add(1, 'days');
      while (days.length < 42) {
        days.push({day: moment(start), classes: 'next-month'});
        start.add(1, 'days');
      }
    }

    return days;
  },

  render: function() {
    var renderDayOfWeek = function(day, i) {
      return <div key={'day-of-week-' + i} className="calendar__cell --day">{day}</div>;
    };

    var renderDay = function(day, i) {
      var classNames = "calendar__cell " + day.classes;
      return (
        <div key={'day-' + i} className={classNames}>
          <span className="calendar__day-label">{day.day.date()}</span>
        </div>
      );
    };

    return (
      <div className="calendar">
        <div className="calendar__head --controls">
          <div className="calendar__prev-btn" onClick={this.prevMonth}></div>
          <div className="calendar__date-display">{this.getMonthName()}</div>
          <div className="calendar__next-btn" onClick={this.nextMonth}></div>
        </div>
        <div className="calendar__head --days-of-week">
          {this.getDaysOfTheWeek().map(renderDayOfWeek)}
        </div>
        <div className='calendar__body'>
          {this.getDays().map(renderDay)}
        </div>
      </div>
    );
  }
});

module.exports = HvReactCalendar;
