// @flow
'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Select from 'react-select'
import {isEmpty} from '../../helpers/common';
import createReactClass  from 'create-react-class';

const MonthlyTrigger = createReactClass({
    propTypes: {
     onSubmit:PropTypes.func
   },
   getInitialState() {
     const {data} = this.props;
     let selectedDate = moment(),selectedTime = moment().add(1, 'Hour').format('HH:MM'),expireEnabled = false,expiryDate = selectedDate,datesSelected = '',classNameExp = 'form-group input-group text-align-center expire-date-daily input-width exp-transparent';
     if((!isEmpty(data))&&data.type=="Monthly") {
      if(!isEmpty(data.endDate)) {
          expireEnabled = true, expiryDate = new moment(new Date(data.endDate))
          classNameExp = 'form-group input-group text-align-center expire-date-daily input-width'
       }
       selectedDate = new moment(new Date(data.startDate)),selectedTime = data.executionTime, datesSelected = data.executeOn;
     }
     return {
      daysvalue: datesSelected,expireEnabled:expireEnabled,selectedDate :selectedDate,selectedTime : selectedTime,selectedExpiryDate : expiryDate,classNameExp:classNameExp

     };
   },
   validateTime(event) {
     if(!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).test(event.target.value))
        event.target.value="";
   },
  handleDaySelectChange (daysvalue) {
       this.setState({ daysvalue });
  },
    expiryDate(expireEnabled) {
      this.setState({
        expireEnabled : expireEnabled.target.checked
      });
      if(expireEnabled.target.checked) {
        this.setState({
          classNameExp : 'form-group input-group text-align-center expire-date-daily input-width'
        });
      }
      else {
        this.setState({
          classNameExp : 'form-group input-group text-align-center expire-date-daily input-width exp-transparent'
        });
      }
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
    handleExpiryDateChange(selectedExpiryDate) {
      this.setState({
           selectedExpiryDate
         });
    },
  render() {
    const {onSubmit} = this.props;
    const dayOptions = [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }];
    return (
      <div className="col-sm-12 col-md-12 form-group input-group no-padding">
      <div className="col-sm-12 col-md-6 form-group input-group no-padding">
      <div className="control-title"> Start Date </div>
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
      <div className="col-sm-12 col-md-12 form-group input-group no-padding">
      <div className="control-title">
        <span className="checkbox checkbox-success expire-checkbox-daily expiry-checkbox">
        Expiry Date <input id="checkbox-expireDate" type="checkbox" defaultChecked={this.state.expireEnabled} onChange={this.expiryDate}  />
          <label htmlFor="checkbox-expireDate" className="top-align"></label>
        </span>
      </div>
      <DatePicker
            className={this.state.classNameExp}
            dateFormat="MMM DD, YYYY"
            locale="en-gb"
            disabled={!this.state.expireEnabled}
            onChange={this.handleExpiryDateChange}
            selected={this.state.selectedExpiryDate}
            minDate={moment()}
          />
      </div>
      <div className="col-sm-12 form-group no-padding">
      <div className="control-title"> Month(s) </div>
      <Select
            name="form-field-name"
            multi
            simpleValue
            value={this.state.daysvalue}
            onChange={this.handleDaySelectChange}
            options={dayOptions}
            />
        </div>
      </div>
  );
  }
});

export default MonthlyTrigger;
