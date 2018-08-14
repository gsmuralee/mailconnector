// @flow
'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {equals, isEmpty} from '../../helpers/common';
import createReactClass  from 'create-react-class';

import 'react-datepicker/dist/react-datepicker.css'

const SingleTrigger = createReactClass({
    propTypes: {
     onSubmit: PropTypes.func
   },
   getInitialState() {
     const {data} = this.props;
     let selectedDate = moment(),selectedTime = moment().add(1, 'Hour').format('HH:MM');
    if((!isEmpty(data))&&data.type=="OneTime") {
      selectedDate = new moment(new Date(data.startDate)),selectedTime = data.executionTime;
    }
     return {
       selectedDate : selectedDate,selectedTime : selectedTime
     };
   },
   validateTime(event) {
     if(!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).test(event.target.value))
        event.target.value="";
   },
   handleDateChange(selectedDate) {
     this.setState({
          selectedDate
        });
   },
   handleTimeChange(selectedTime) {
     this.setState({
          selectedTime : selectedTime.target.value
        });
   },
  render() {
    const {onSubmit} = this.props;
    return (
      <div className="col-sm-12 col-md-12 form-group input-group no-padding">
      <div className="col-sm-12 col-md-6 form-group input-group no-padding">
      <div className="control-title"> Date </div>
      <DatePicker
            className="form-group input-group text-align-center"
            dateFormat="MMM DD, YYYY"
            locale="en-gb"
            onChange={this.handleDateChange}
            selected={this.state.selectedDate}
            minDate={moment()}
          />
      </div>
      <div className="col-sm-12 col-md-6 form-group input-group no-padding">
      <div className="control-title"> Time </div>
          <input className="form-control time-input" placeholder="Time(23:59)" type="text" value={this.state.selectedTime} onChange={this.handleTimeChange} onBlur={this.validateTime} name="scheduleTime" />
      </div>
      </div>
  );
  }
});

export default SingleTrigger;
