// @flow
'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import {isEmpty} from '../../helpers/common';
import createReactClass  from 'create-react-class';
require('../../loader.css')
const loaderImage = require('../../images/visualbi_loader.png')

const CustomLoader = createReactClass({
  propTypes :{
    isActive: PropTypes.bool,
    loadingType: PropTypes.string,
    customClass: PropTypes.string
  },
  render() {
    const {isActive,loadingType,customClass} = this.props;
    let finalClass = "custom-loading "
    if(!isEmpty(customClass)) {
         finalClass+= customClass
    }
    return (
      <span>
        {(isActive)?(<div className={finalClass}><div className="custom-loading-wrapper">
          <div className="teamlogo">
            <div className="teamslogo-anim">
              <img src={loaderImage} className="loader-image" />
            </div>
          </div>
          <div className="textwrapper">
            {(loadingType=="error")?(<span className="loadingtext">We couldn't establish the connection with Server, Make sure that the Server is running and accessible.</span>):(<span><span className="loadingtext">{loadingType}</span><span className="dot showone">.
            </span>
            <span className="dot showtwo">.</span>
            <span className="dot showthree">.</span></span>)}
          </div>
        </div>
      </div>):(<span></span>)}
    </span>
    );
  }
});

export default CustomLoader;
