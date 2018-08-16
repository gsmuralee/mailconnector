// @flow
'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {isEmpty} from '../../helpers/common';
import Select from 'react-select'   
import createReactClass  from 'create-react-class';
import 'react-datepicker/dist/react-datepicker.css'

const HourlyTrigger = createReactClass({
    propTypes: {
     onSubmit:PropTypes.func
   },
   getInitialState() {
     const {data} = this.props;
     let selectedDate = moment(),selectedTime = moment().add(1, 'Hour').format('HH:MM'),expireEnabled = false,expiryDate = selectedDate,classNameExp = 'form-group input-group text-align-center expire-date-daily input-width exp-transparent',hoursvalue = '',minutesvalue = '';
      if((!isEmpty(data))&&data.type=="Hourly") {
        if(!isEmpty(data.endDate)) {
          expireEnabled = true, expiryDate = new moment(new Date(data.endDate))
          classNameExp = 'form-group input-group text-align-center expire-date-daily input-width'
       }
       let minutes = data.executeOn%60,hours= (data.executeOn-minutes)/60;
        selectedDate = new moment(new Date(data.startDate)),selectedTime = data.executionTime,hoursvalue = '' +hours,minutesvalue = '' +minutes
      }
       return {
       expireEnabled:expireEnabled,selectedDate :selectedDate,selectedTime : selectedTime,selectedExpiryDate : expiryDate,classNameExp:classNameExp,hoursvalue:hoursvalue,minutesvalue:minutesvalue
     };
   },
   validateTime(event) {
     if(!(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).test(event.target.value))
        event.target.value="";
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
 
  handleHourSelectChange (hoursvalue) {
      this.setState({ hoursvalue });
  },
  handleMinuteSelectChange (minutesvalue) {
    this.setState({ minutesvalue });
  },
  render() {
    const {onSubmit} = this.props;
    const hourOption = [{ value: '0', label: '0' },{ value: '1', label: '1' } , { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }, { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' }, { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' }, { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' }];
    const minuteOption = [{ value: '0', label: '0' },{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }, { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' }, { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' }, { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' },{ value: '24', label: '24' }, { value: '25', label: '25' }, { value: '26', label: '26' }, { value: '27', label: '27' }, { value: '28', label: '28' }, { value: '29', label: '29' }, { value: '30', label: '30' }, { value: '31', label: '31' }, { value: '32', label: '32' }, { value: '33', label: '33' }, { value: '34', label: '34' }, { value: '35', label: '35' }, { value: '36', label: '36' }, { value: '37', label: '37' }, { value: '38', label: '38' }, { value: '39', label: '39' }, { value: '40', label: '40' }, { value: '41', label: '41' }, { value: '42', label: '42' }, { value: '43', label: '43' }, { value: '44', label: '44' }, { value: '45', label: '45' }, { value: '46', label: '46' }, { value: '47', label: '47' }, { value: '48', label: '48' }, { value: '49', label: '49' }, { value: '50', label: '50' }, { value: '51', label: '51' }, { value: '52', label: '52' }, { value: '53', label: '53' }, { value: '54', label: '54' }, { value: '55', label: '55' }, { value: '56', label: '56' }, { value: '57', label: '57' }, { value: '58', label: '58' }, { value: '59', label: '59' }];
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
      <div className="control-title"> Start Time </div>
          <input className="form-control time-input" placeholder="Time(23:59)" type="text" value={this.state.selectedTime} onChange={this.handleTimeChange} onBlur={this.validateTime} name="scheduleTime" />
      </div>
      <div className="col-sm-12 col-md-6 form-group input-group no-padding padding-margin-right">
      <div className="control-title"> Hour </div>
      <Select
            name="form-field-name"
            simpleValue
            value={this.state.hoursvalue}
            onChange={this.handleHourSelectChange}
            options={hourOption}
            />
      </div>
      <div className="col-sm-12 col-md-6 form-group input-group no-padding">
      <div className="control-title"> Minute </div>
      <Select
        name="form-field-name"
        simpleValue
        value={this.state.minutesvalue}
        onChange={this.handleMinuteSelectChange}
        options={minuteOption}
        />
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
      </div>
  );
  }
});

export default HourlyTrigger;
