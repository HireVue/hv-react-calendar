var HvReactCalendar =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var moment    = __webpack_require__(1);
	var React     = __webpack_require__(2);
	var PropTypes = React.PropTypes;

	var defaultProps = {
	    locale       : 'en',
	    forceSixRows : false,
	    disablePast  : false
	};

	var HvReactCalendar = React.createClass({displayName: "HvReactCalendar",

	  propTypes: {
	    locale        : PropTypes.string,
	    currentDate   : PropTypes.instanceOf(Date),
	    forceSixRows  : PropTypes.bool,
	    disablePast   : PropTypes.bool,
	    dateClasses   : PropTypes.arrayOf(PropTypes.shape({
	      date        : PropTypes.instanceOf(Date),
	      classNames  : PropTypes.string
	    })),
	    onDateSelect  : PropTypes.func,
	    onMonthChange : PropTypes.func
	  },

	  getDefaultProps: function() {
	      return defaultProps;
	  },

	  getInitialState: function() {
	    return {
	      date: moment(),
	      dateClasses: {}
	    }
	  },

	  componentWillMount: function() {
	    if (this.props.currentDate) {
	      if (this.props.disablePast && this.props.currentDate < new Date()) {
	        this.setState({date: moment()});
	      } else {
	        this.setState({date: moment(this.props.currentDate)});
	      }
	    }
	    if (this.props.dateClasses) {
	      this.setState({dateClasses: this.mapDateClasses(this.props.dateClasses)});
	    }
	  },

	  componentWillReceiveProps: function(nextProps) {
	    if (nextProps.dateClasses) {
	      this.setState({dateClasses: this.mapDateClasses(nextProps.dateClasses)});
	    }

	    if (nextProps.currentDate && nextProps.currentDate !== this.props.currentDate) {
	      if (this.props.disablePast && nextProps.currentDate < new Date()) {
	        this.setState({date: moment()});
	      } else {
	        this.setState({date: moment(nextProps.currentDate)});
	      }
	    }
	  },

	  nextMonth: function() {
	    this.setState({date: this.state.date.add(1, 'months')});
	    if (this.props.onMonthChange) {
	      this.props.onMonthChange(moment(this.state.date).startOf('month').toDate());
	    }
	  },

	  prevMonth: function() {
	    if (!this.isLastMonthDisabled()) {
	      this.setState({date: this.state.date.subtract(1, 'months')});
	      if (this.props.onMonthChange) {
	        this.props.onMonthChange(moment(this.state.date).startOf('month').toDate());
	      }
	    }
	  },

	  isLastMonthDisabled: function() {
	    if (!this.props.disablePast) {
	      return false;
	    } else {
	      var currentDate = this.state.date.toDate();
	      var now         = new Date();
	      var prevMonth   = new Date(currentDate.getFullYear(), currentDate.getMonth()-1);
	      if (prevMonth < new Date(now.getFullYear(), now.getMonth())) {
	        return true;
	      }
	    }
	    return false;
	  },

	  i18n: function() {
	      return moment.localeData(this.props.locale) ||
	             moment.localeData(defaultProps.locale);
	  },

	  getMonthName: function() {
	    return this.i18n().months(this.state.date) + ' ' + this.state.date.get('year');
	  },

	  /* make the days of the week */
	  getDaysOfTheWeek: function() {
	    var i18n = this.i18n()
	    var weekdays = [];
	    for (var i = i18n.firstDayOfWeek(); i < 7+i18n.firstDayOfWeek(); i++) {
	      weekdays.push(i18n.weekdaysMin(moment().weekday(i)));
	    }
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
	    var days  = [];
	    var date  = this.state.date.startOf('month');
	    var diff  = date.weekday() - this.i18n().firstDayOfWeek();
	    var today = (new Date()).getDate();
	    if (diff < 0) diff += 7;

	    var i, day, classes;
	    for (i = 0; i < diff; i++) {
	      day = moment().set({year: this.state.date.year(), month: this.state.date.month(), date: i-diff+1});
	      classes = 'calendar__cell --prev-month ' + this.getDateClasses(day.format('YYYY-MM-DD'));
	      days.push({day: day, classes: classes });
	    }

	    var numberOfDays = date.daysInMonth();
	    for (i = 1; i <= numberOfDays; i++) {
	      day = moment().set({year: this.state.date.year(), month: this.state.date.month(), date: i});
	      classes = 'calendar__cell --this-month ' + this.getDateClasses(day.format('YYYY-MM-DD'));
	      if (i < today) {
	        classes += ' --past';
	      }
	      days.push({day: day, classes: classes});
	    }

	    i = 1;
	    while (days.length % 7 !== 0) {
	      day = moment().set({year: this.state.date.year(), month: this.state.date.month(), date: numberOfDays+i});
	      classes = 'calendar__cell --next-month ' + this.getDateClasses(day.format('YYYY-MM-DD'));
	      days.push({day: day, classes: classes});
	      i++;
	    }

	    if (this.props.forceSixRows && days.length !== 42) {
	      var start = moment(days[days.length-1].day).add(1, 'days');
	      while (days.length < 42) {
	        classes = 'calendar__cell --next-month ' + this.getDateClasses(moment(start).format('YYYY-MM-DD'));
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
	      return React.createElement("div", {key: 'day-of-week-' + i, className: "calendar__cell --day"}, day);
	    };

	    var renderDay = function(day, i) {
	      var classNames = "calendar__cell " + day.classes;
	      return (
	        React.createElement("div", {key: 'day-' + i, className: classNames, onClick: this.handleClick.bind(this, day.day)}, 
	          React.createElement("span", {className: "calendar__day-label"}, day.day.date())
	        )
	      );
	    };

	    return (
	      React.createElement("div", {className: "calendar"}, 
	        React.createElement("div", {className: "calendar__head --controls"}, 
	          React.createElement("div", {className: "calendar__prev-btn" + (this.isLastMonthDisabled() ? " --disabled" : ""), onClick: this.prevMonth}), 
	          React.createElement("div", {className: "calendar__date-display"}, this.getMonthName()), 
	          React.createElement("div", {className: "calendar__next-btn", onClick: this.nextMonth})
	        ), 
	        React.createElement("div", {className: "calendar__head --days-of-week"}, 
	          this.getDaysOfTheWeek().map(renderDayOfWeek)
	        ), 
	        React.createElement("div", {className: "calendar__body"}, 
	          this.getDays().map(renderDay, this)
	        )
	      )
	    );
	  }
	});

	module.exports = HvReactCalendar;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = moment;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ }
/******/ ]);