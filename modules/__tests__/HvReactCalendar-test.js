var assert          = require('assert');
var React           = require('react/addons');
var TestUtils       = React.addons.TestUtils;
var HvReactCalendar = require('../HvReactCalendar');

function createCalendar(props) {
  props              = props              || {};
  props.locale       = props.locale       || 'en';
  props.startOfWeek  = props.startOfWeek  || 'sunday';
  props.currentDate  = props.currentDate  || null;
  props.forceSixRows = props.forceSixRows || false;
  props.dateClasses  = props.dateClasses  || null;
  props.onDateSelect = props.onDateSelect || null;

  return (
    <HvReactCalendar
      locale={props.locale}
      startOfWeek={props.startOfWeek}
      currentDate={props.currentDate}
      forceSixRows={props.forceSixRows}
      dateClasses={props.dateClasses}
      onDateSelect={props.onDateSelect}
    />
  );
}

describe('HvReactCalendar', function() {

  describe('interaction', function() {

    it('should go to the next month when next button clicked', function() {
      var calendar = TestUtils.renderIntoDocument(createCalendar({currentDate: new Date(2014, 1, 1)}));
      TestUtils.Simulate.click(calendar.getDOMNode().getElementsByClassName('calendar__next-btn')[0]);
      var dateLabel = calendar.getDOMNode().getElementsByClassName('calendar__date-display')[0].innerHTML;
      assert.equal(dateLabel, "March 2014");
    });

    it('should go to the previous month when the previous button clicked', function() {
      var calendar = TestUtils.renderIntoDocument(createCalendar({currentDate: new Date(2014, 1, 1)}));
      TestUtils.Simulate.click(calendar.getDOMNode().getElementsByClassName('calendar__prev-btn')[0]);
      var dateLabel = calendar.getDOMNode().getElementsByClassName('calendar__date-display')[0].innerHTML;
      assert.equal(dateLabel, "January 2014");
    });

  });

  describe('props', function() {

    it('should localize when given a locale', function() {
      var props = {
        currentDate: new Date(2014, 2, 1),
        locale: 'de'
      };
      var calendar = TestUtils.renderIntoDocument(createCalendar(props));
      var dateLabel = calendar.getDOMNode().getElementsByClassName('calendar__date-display')[0].innerHTML;
      assert.equal(dateLabel, "März 2014");
    });

    it('should allow for Monday to be the start of the week', function() {
      var calendar = TestUtils.renderIntoDocument(createCalendar({startOfWeek: 'monday'}));
      var dateLabel = calendar.getDOMNode().getElementsByClassName('calendar__head --days-of-week')[0].firstChild.innerHTML;
      assert.equal(dateLabel, "Mo");
    });

    it('should allow for explicit setting of current date', function() {
      var calendar = TestUtils.renderIntoDocument(createCalendar({currentDate: new Date(2014, 1, 1)}));
      var dateLabel = calendar.getDOMNode().getElementsByClassName('calendar__date-display')[0].innerHTML;
      assert.equal(dateLabel, "February 2014");
    });

    it('should allow for the explicit displaying of 6 rows', function() {
      var props = {
        currentDate: new Date(2014, 1, 1),
        forceSixRows: true
      };
      var calendar = TestUtils.renderIntoDocument(createCalendar(props));
      var dayCells = calendar.getDOMNode().getElementsByClassName('calendar__day-label');
      assert.equal(dayCells.length, 42);
    });

    it('should apply date classes to specified dates', function() {
      var props = {
        currentDate: new Date(2014, 1, 1),
        dateClasses: [
          {
            date: new Date(2014, 1, 1),
            classNames: 'zut-alors'
          },
          {
            date: new Date(2014, 1, 15),
            classNames: 'walla-wall'
          },
          {
            date: new Date(2014, 2, 31),
            classNames: 'cowabunga'
          },
        ]
      };
      var calendar = TestUtils.renderIntoDocument(createCalendar(props));

      var case1 = calendar.getDOMNode().getElementsByClassName('zut-alors')[0].firstChild.innerHTML;
      assert.equal(case1, 1);

      var case2 = calendar.getDOMNode().getElementsByClassName('walla-wall')[0].firstChild.innerHTML;
      assert.equal(case2, 15);

      // not in current month, so shouldn't be found
      var case3 = calendar.getDOMNode().getElementsByClassName('cowabunga');
      assert.equal(case3.length, 0);

      // make sure it's found where it's supposed to be
      TestUtils.Simulate.click(calendar.getDOMNode().getElementsByClassName('calendar__next-btn')[0]);
      var case4 = calendar.getDOMNode().getElementsByClassName('cowabunga')[0].firstChild.innerHTML;
      assert.equal(case4, 31);
    });

    it('should handle clicks', function() {
      var result;
      var props = {
        currentDate: new Date(2014, 1, 1),
        onDateSelect: function(date) {
          result = date;
        }
      };
      var calendar = TestUtils.renderIntoDocument(createCalendar(props));
      TestUtils.Simulate.click(calendar.getDOMNode().getElementsByClassName('calendar__cell --this-month')[10]);
      assert.equal(result.getFullYear(), 2014);
      assert.equal(result.getMonth(), 1);
      assert.equal(result.getDate(), 11);
    });

  });

});
