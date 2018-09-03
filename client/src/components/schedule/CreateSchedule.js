// @flow
'use strict'
import React from 'react'
import {DropdownButton,MenuItem,Modal,Button} from 'react-bootstrap'
import PropTypes from 'prop-types'
import {equals, isEmpty} from '../../helpers/common'
import createReactClass  from 'create-react-class';
import SingleTrigger from './SingleTrigger'
import HourlyTrigger from './HourlyTrigger'
import DailyTrigger from './DailyTrigger'
import WeeklyTrigger from './WeeklyTrigger'
import MonthlyTrigger from './MonthlyTrigger'
import AddFilterForm from './addFilterForm'
import Filter from './Filter'
import CustomLoader from './CustomLoader'
import DeleteModal from './DeleteModal'
import {v4} from 'uuid';

const ScheduleTrigger = createReactClass({
  propTypes :{
    scheduleType: PropTypes.string,
    onSubmit: PropTypes.func
  },
  render() {
    const {scheduleType,onSubmit,data} = this.props;
    switch(scheduleType) {
      case 'ScheduleNow': return(
                        <span></span>
                      );
                      break;
      case 'OneTime': return(
                        <SingleTrigger ref="singleTrigger" data={data} onSubmit={onSubmit} />
                      );
                      break;
      case 'Hourly': return(
                        <HourlyTrigger ref="hourlyTrigger" data={data} onSubmit={onSubmit} />
                      );
                      break;
      case 'Daily': return(
                        <DailyTrigger ref="dailyTrigger" data={data} onSubmit={onSubmit} />
                      );
                      break;
      case 'Weekly': return(
                        <WeeklyTrigger ref="weeklyTrigger" data={data} onSubmit={onSubmit} />
                      );
                      break;
      case 'Monthly': return(
                        <MonthlyTrigger ref="monthlyTrigger" data={data} onSubmit={onSubmit} />
                      );
                      break;
      default: return(
                        <span></span>
                      ); break;
    }
  }
});

function Delete(props){
  const {data, onDelete} = props;
  if(!isEmpty(data)){
    const id = data['@rid']
    return <input type="submit" onClick={(scheduleId) => onDelete(id)} className="btn btn-add user-view" value="Delete" /> 
  }
  return ''
}

const CreateSchedule =  createReactClass({
  propTypes: {
     onHide:   PropTypes.func,
     onCreate: PropTypes.func,
     isActive: PropTypes.bool,
     onDismiss: PropTypes.func
   },
  getInitialState() {
    return {
      'error':'',
      'authenticationMethod':'Authentication',
      'connected':true,
      'connectionClass':'btn btn-add user-view test-conn-button connection-orange',
       scheduleType: 'Schedule Type',
      'showSubmitLoadingIndicator': 'display-none',
      'showLoadingIndicator': 'display-none',
      'customLoaderClass': 'opacity-7',
      'loadingActive':true,
      'loadingText':'Fetching User',
      'formfilters': [],
      'cfminValue':'',
      'cfmaxValue':'',
      'globalScript':'',
      'addfilters': false,
      'cfStatus': false,
      'gsStatus': false,
      'deletePopUp': false,
      'currentFilter':{}
    };
  },
  handleSubmit(event) {
    event.preventDefault();
    const {onCreate} = this.props;
    const scheduleData = {};
    const now = new Date();
    now.setMinutes(now.getMinutes()+2);
    scheduleData.cuid = this.props.cuid;
    scheduleData.type = this.state.scheduleType;
    scheduleData.cfminValue = this.cfminValue.value;
    scheduleData.cfmaxValue = this.cfmaxValue.value;
    scheduleData.globalScript = this.globalScript.value
    scheduleData.formfilters = this.state.formfilters
    if(!isEmpty(this.props.data)){
      scheduleData.scheduleId = this.props.data['@rid'];
    }
    if(equals(scheduleData.type,'Schedule Type'))
      this.setState({'error':'Schedule Type is Required'})
    else if (equals(scheduleData.type,'Hourly')&&isEmpty(this.refs.scheduleTrigger.refs.hourlyTrigger.state.hoursvalue))
      this.setState({'error':'Execution Hour is required'})
    else if (equals(scheduleData.type,'Hourly')&&isEmpty(this.refs.scheduleTrigger.refs.hourlyTrigger.state.minutesvalue))
      this.setState({'error':'Execution Minute is required'})
    else if (equals(scheduleData.type,'Weekly')&&isEmpty(this.refs.scheduleTrigger.refs.weeklyTrigger.state.weekdayvalue))
      this.setState({'error':'Week day(s) is required'})
    else if (equals(scheduleData.type,'Monthly')&&isEmpty(this.refs.scheduleTrigger.refs.monthlyTrigger.state.daysvalue))
      this.setState({'error':'Month is required'})
    else {
      this.setState({'error':'','showSubmitLoadingIndicator':'display-block'});
      switch (this.state.scheduleType) {
                  case 'ScheduleNow':
                                scheduleData.type = 'ScheduleNow'
                                break;
                  case 'OneTime':
                                scheduleData.startDate = this.refs.scheduleTrigger.refs.singleTrigger.state.selectedDate.format('MM/DD/YYYY');
                                scheduleData.executionTime = this.refs.scheduleTrigger.refs.singleTrigger.state.selectedTime;
                                scheduleData.endDate = this.refs.scheduleTrigger.refs.singleTrigger.state.selectedDate.format('MM/DD/YYYY');
                                break;
                  case 'Daily':
                                scheduleData.startDate = this.refs.scheduleTrigger.refs.dailyTrigger.state.selectedDate.format('MM/DD/YYYY');
                                scheduleData.executionTime = this.refs.scheduleTrigger.refs.dailyTrigger.state.selectedTime;
                                //scheduleData.expiryEnabled = this.refs.scheduleTrigger.refs.dailyTrigger.state.expireEnabled;
                                if(this.refs.scheduleTrigger.refs.dailyTrigger.state.expireEnabled) {
                                    scheduleData.endDate = this.refs.scheduleTrigger.refs.dailyTrigger.state.selectedExpiryDate.format('MM/DD/YYYY');
                                }
                                break;
                  case 'Hourly':
                                scheduleData.startDate = this.refs.scheduleTrigger.refs.hourlyTrigger.state.selectedDate.format('MM/DD/YYYY');
                                scheduleData.executionTime = this.refs.scheduleTrigger.refs.hourlyTrigger.state.selectedTime;
                                //scheduleData.expiryEnabled = this.refs.scheduleTrigger.refs.hourlyTrigger.state.expireEnabled;
                                if(this.refs.scheduleTrigger.refs.hourlyTrigger.state.expireEnabled) {
                                    scheduleData.endDate = this.refs.scheduleTrigger.refs.hourlyTrigger.state.selectedExpiryDate.format('MM/DD/YYYY');
                                }
                                let hours = parseInt(this.refs.scheduleTrigger.refs.hourlyTrigger.state.hoursvalue)*60;
                                let minutes = parseInt(this.refs.scheduleTrigger.refs.hourlyTrigger.state.minutesvalue);
                                scheduleData.executeInterval = hours+minutes;
                                break;
                  case 'Weekly':
                                scheduleData.startDate = this.refs.scheduleTrigger.refs.weeklyTrigger.state.selectedDate.format('MM/DD/YYYY');
                                scheduleData.executionTime = this.refs.scheduleTrigger.refs.weeklyTrigger.state.selectedTime;
                                //scheduleData.expiryEnabled = this.refs.scheduleTrigger.refs.weeklyTrigger.state.expireEnabled;
                                if(this.refs.scheduleTrigger.refs.weeklyTrigger.state.expireEnabled) {
                                    scheduleData.endDate = this.refs.scheduleTrigger.refs.weeklyTrigger.state.selectedExpiryDate.format('MM/DD/YYYY');
                                }
                                scheduleData.executeOn = this.refs.scheduleTrigger.refs.weeklyTrigger.state.weekdayvalue;
                                break;
                  case 'Monthly':
                                scheduleData.startDate = this.refs.scheduleTrigger.refs.monthlyTrigger.state.selectedDate.format('MM/DD/YYYY');
                                scheduleData.executionTime = this.refs.scheduleTrigger.refs.monthlyTrigger.state.selectedTime;
                                //scheduleData.expiryEnabled = this.refs.scheduleTrigger.refs.monthlyTrigger.state.expireEnabled;
                                if(this.refs.scheduleTrigger.refs.monthlyTrigger.state.expireEnabled) {
                                    scheduleData.endDate = this.refs.scheduleTrigger.refs.monthlyTrigger.state.selectedExpiryDate.format('MM/DD/YYYY');
                                }
                                scheduleData.executeOn = this.refs.scheduleTrigger.refs.monthlyTrigger.state.daysvalue;
                                break;
                  default:
                          break;
      }
      // scheduleData.startDate = JSON.stringify(scheduleData.startDate);
      // scheduleData.endDate = JSON.stringify(scheduleData.endDate);
      onCreate(scheduleData);
      this.setState({'showSubmitLoadingIndicator':'display-none'})
    }
    },
  handleDropDown(eventKey) {
      this.setState({'scheduleType':eventKey});
      this.setState({'error':''});
  },

  componentWillReceiveProps(nextProps) {
    const {type,data} = nextProps;
    console.log(this.props, data, nextProps);
    if(!isEmpty(data)) {
      //this.setState({'loadingActive':true,'loadingText':'Fetching Schedule','customLoaderClass':'opacity-7','scheduleType':''});
      this.cfminValue.value = data.cfminValue ? data.cfminValue : '';
      this.cfmaxValue.value = data.cfmaxValue ? data.cfmaxValue : '';
      this.globalScript.value = data.globalScript ? data.globalScript : '';
      this.setState({formfilters: data.formfilters ? data.formfilters : [], scheduleType:data.type,'loadingActive':false,'loadingText':'','customLoaderClass':''});
    }
  },

  onNewFilter(name, dsAlias, dimension, filterString, id){
    const formfilters = this.state.formfilters.filter(f => f.id !== id )
    const cid = id ? id : v4()
    this.setState({'formfilters': [...formfilters, {name, dsAlias, dimension, filterString, id:cid}], 'currentFilter': {}})
  },

  onCFCheck(e){
    this.setState({'cfStatus': e.target.checked})
  },

  onGSCheck(e){
    this.setState({'gsStatus': e.target.checked})
  },

  onFilterCheck(e){
    this.setState({'addfilters': e.target.checked})
  },

  removeFilter(id){
    const formfilters = this.state.formfilters.filter(f => f.id !== id )
    this.setState({formfilters});
  },

  editFilter(id){
    const [filter] = this.state.formfilters.filter(f => f.id == id )
    this.setState({'currentFilter': filter})
  },

  render() {
    const {data,type,onHide,onCreate,onDelete,show,onDismiss,isActive} = this.props;
    let className;
    if(isActive) className='overlay-head'
    else className='overlay-hide'
    return(
      <div className={className}>
        <div className='overlay-sidebar'>
          <div className='overlay-rest' onClick={onDismiss}></div>
            <div className='overlay-layer-container'>
              <div className='col-sm-12 col-md-12'>
                <h4 className='heading-form font-weight-600'>{type}</h4>
                <div className='col-sm-12 col-md-12'>
                    <div className='col-sm-12 col-md-12 form-group input-group zero-margin'>
                    <h4 className='heading-form-small'>Schedule Type</h4>
                    <div className="scheduletype-dropdown">
                        <DropdownButton bsStyle="default" title={this.state.scheduleType} id={`selectedScheduleType`} onSelect={this.handleDropDown}>
                        <MenuItem eventKey="ScheduleNow">Schedule Now</MenuItem>  
                        <MenuItem eventKey="OneTime">One Time</MenuItem>
                        <MenuItem eventKey="Hourly">Hourly</MenuItem>
                        <MenuItem eventKey="Daily">Daily</MenuItem>
                        <MenuItem eventKey="Weekly">Weekly</MenuItem>
                        <MenuItem eventKey="Monthly">Monthly</MenuItem>                          
                        </DropdownButton>
                    </div>
                  </div>
                  <div className='col-sm-12 col-md-12 form-group input-group zero-margin padding-top-20'>
                    <ScheduleTrigger ref="scheduleTrigger" scheduleType={this.state.scheduleType} data={data} onSubmit={this.handleSubmit} />
                  </div>
                  <div className='col-sm-12 col-md-12 form-group input-group zero-margin padding-top-20'>
                    <span className="checkbox checkbox-success expire-checkbox-daily expiry-checkbox">
                      Conditional Formating <input id="checkbox-cf" type="checkbox" defaultChecked={false} onChange={this.onCFCheck}  />
                      <label htmlFor="checkbox-cf" className="top-align"></label>
                    </span>
                    <div className={`col-sm-12 col-md-6 form-group input-group no-padding ${this.state.cfStatus ? '':'hidden'}`}>    
                        <div className="control-title"> Min Value </div> 
                        <input  className="form-group input-group text-align-center" type='input' ref={(input) => { this.cfminValue = input; }} name='cfminValue' placeholder="min Value" />
                    </div>
                    <div className={`col-sm-12 col-md-6 form-group input-group no-padding ${this.state.cfStatus ? '':'hidden'}`}>
                    <div className="control-title"> Max Value </div>
                        <input className="form-group input-group text-align-center"  type='input' ref={(input) => { this.cfmaxValue = input; }} name='cfmaxValue' placeholder="max Value" />
                    </div>
                  </div>
                  <div className='col-sm-12 col-md-12 form-group input-group zero-margin padding-top-20'>
                  <span className="checkbox checkbox-success expire-checkbox-daily expiry-checkbox">
                    Global Script <input id="checkbox-gs" type="checkbox" defaultChecked={false} onChange={this.onGSCheck}  />
                    <label htmlFor="checkbox-gs" className="top-align"></label>
                  </span>
                    <div className={this.state.gsStatus ? '':'hidden'}>
                      <input className="form-control" type='input' ref={(input) => { this.globalScript = input; }} name='globalScript' placeholder="Script" />
                    </div>
                  </div>
                  <div className='col-sm-12 col-md-12 form-group input-group zero-margin padding-top-20'>
                  <span className="checkbox checkbox-success expire-checkbox-daily expiry-checkbox">
                    Filter <input id="checkbox-filter" type="checkbox" defaultChecked={false} onChange={this.onFilterCheck}  />
                    <label htmlFor="checkbox-filter" className="top-align"></label>
                  </span>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">DS Alias</th>
                          <th scope="col">Dimension</th>
                          <th scope="col">Filter String</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.formfilters.map((filter, i) => 
                          <Filter key={i} onEdit={() => this.editFilter(filter.id)} onDelete={() => this.removeFilter(filter.id)} {...filter}/>
                        )}
                      </tbody>
                    </table>
                    <AddFilterForm enabled={this.state.addfilters} onNewFilter={this.onNewFilter} filter={this.state.currentFilter} />
                  </div>
                  <div className='col-sm-12 col-md-12 form-group input-group zero-margin'>
                    <div className='errorTxt'>{this.state.error}</div>
                  </div>
                </div>
                <span className="user-view-buttons float-right">
                  <Delete data={data} onDelete={onDelete}/>&nbsp;&nbsp;&nbsp;
                  <input type="submit" onClick={onDismiss} className="btn btn-add user-view" value="Dismiss" /> &nbsp;&nbsp;&nbsp;
                  <input type="submit" onClick={this.handleSubmit} className="btn btn-add user-view" value="Save" />
                </span>
              </div>
              <div className={this.state.showSubmitLoadingIndicator}>
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" style={{fontSize:20}} x="0px" y="0px"
                     width="24px" height="30px" viewBox="0 0 24 30">
                    <rect x="0" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5"
                        begin="0s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="10" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5"
                        begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                    <rect x="20" y="13" width="4" height="5" fill="#333">
                      <animate attributeName="height" attributeType="XML"
                        values="5;21;5"
                        begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                      <animate attributeName="y" attributeType="XML"
                        values="13; 5; 13"
                        begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                    </rect>
                  </svg> <b> Creating Schedule...</b>
              </div>
            </div>
        </div>
      </div>
    );
  }
});

export default CreateSchedule;
