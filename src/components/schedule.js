import React from 'react';
const Schedule = ({isActive, onDismiss, onCreate}) => {
    let className = isActive ? 'overlay-head': 'overlay-hide';
    
    return(
      <div className={className}>
        <div className='overlay-sidebar'>
          <div className='overlay-rest' onClick={onDismiss}></div>
            <div className='overlay-layer-container'>
              <div className='col-sm-12 col-md-12'>
                <h4 className='heading-form font-weight-600'>View Schedule</h4>
                <div className='col-sm-12 col-md-12'>
                <div className='col-sm-12 col-md-12 form-group input-group zero-margin'>
                  <table className="view-info-table table table-bordered">
                    <tbody>
                        <tr><td>Name</td><td><b>name</b></td></tr>
                        <tr><td>Schedule Type</td><td><b>type</b></td></tr>
                      </tbody>
                  </table>
                </div>
                </div>
                <span className="user-view-buttons float-right">
                </span>
              </div>
            </div>
        </div>
        
      </div>
    )
}

export default Schedule