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
    })),
    onDateSelect : PropTypes.func
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
      date: moment(),
      dateClasses: {}
    }
  },

  componentWillMount: function() {
    if (this.props.currentDate) {
      this.setState({date: moment(this.props.currentDate)});
    }
    if (this.props.dateClasses) {
      this.setState({dateClasses: this.mapDateClasses(this.props.dateClasses)});
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.dateClasses) {
      this.setState({dateClasses: this.mapDateClasses(nextProps.dateClasses)});
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

  getDateClasses: function(dateKey) {
    return this.state.dateClasses[dateKey] || '';
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
      var day = moment([this.state.date.year(), this.state.date.month(), i-diff+1]);
      var classes = 'calendar__cell --prev-month ' + this.getDateClasses(day.format('YYYY-MM-DD'));
      days.push({day: day, classes: classes });
    }

    var numberOfDays = date.daysInMonth();
    for (i = 1; i <= numberOfDays; i++) {
      var day = moment([this.state.date.year(), this.state.date.month(), i]);
      var classes = this.getDateClasses(day.format('YYYY-MM-DD'));
      days.push({day: day, classes: classes});
    }

    i = 1;
    while (days.length % 7 !== 0) {
      var day = moment([this.state.date.year(), this.state.date.month(), numberOfDays+i]);
      var classes = 'calendar__cell --next-month ' + this.getDateClasses(day.format('YYYY-MM-DD'));
      days.push({day: day, classes: classes});
      i++;
    }

    if (this.props.forceSixRows && days.length !== 42) {
      var start = moment(days[days.length-1].day).add(1, 'days');
      while (days.length < 42) {
        var classes = 'calendar__cell --next-month ' + this.getDateClasses(moment(start).format('YYYY-MM-DD'));
        days.push({day: moment(start), classes: classes});
        start.add(1, 'days');
      }
    }

    return days;
  },

  handleClick: function(day) {
    if (this.props.onDateSelect) {
      this.props.onDateSelect(day.toDate());
    }
  },

  mapDateClasses: function(dateClassesArray) {
    var dateClassesMap = {};
    dateClassesArray.forEach(function(dateClass) {
      var key = moment(dateClass.date).format('YYYY-MM-DD');
      dateClassesMap[key] = dateClass.classNames;
    });
    return dateClassesMap;
  },

  render: function() {
    var renderDayOfWeek = function(day, i) {
      return <div key={'day-of-week-' + i} className="calendar__cell --day">{day}</div>;
    };

    var renderDay = function(day, i) {
      var classNames = "calendar__cell " + day.classes;
      return (
        <div key={'day-' + i} className={classNames} onClick={this.handleClick.bind(this, day.day)}>
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
          {this.getDays().map(renderDay, this)}
        </div>
      </div>
    );
  }
});

module.exports = HvReactCalendar;
