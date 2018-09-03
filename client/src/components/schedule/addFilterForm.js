import React, {Component} from 'react';
import {isEmpty} from '../../helpers/common'

class AddFilterForm extends Component {
    constructor(props){
        super(props);   
        this.submit = this.submit.bind(this);
        this.state = {
            render: false
        }
    }
    submit(e){
        e.preventDefault();
        this.props.onNewFilter(this.name.value, this.dsAlias.value, this.dimension.value, this.filterString.value, this.props.filter.id);
        this.name.value='';this.dsAlias.value=''; this.dimension.value=''; this.filterString.value='';
    }

    componentWillReceiveProps(prevProps) {
        const {filter} = prevProps;
        if(!isEmpty(filter)) {
          this.name.value = filter.name ? filter.name : '';
          this.dsAlias.value = filter.dsAlias ? filter.dsAlias : '';
          this.dimension.value = filter.dimension ? filter.dimension : '';
          this.filterString.value = filter.filterString ? filter.filterString : '';
        }
    }
    
    render(){
        if(!this.props.enabled) return ''
        return (
            <form onSubmit={this.submit}>
                <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
                <input className="form-control" ref={input => this.name = input} type="text" placeholder="Name" required/> </div>
                <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
                <input className="form-control" ref={input => this.dsAlias = input} type="text" placeholder="DS Alias" required/> </div>
                <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
                <input className="form-control" ref={input => this.dimension = input} type="text"  placeholder="Dimension" required/></div>
                <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
                <input className="form-control" ref={input => this.filterString = input} type="text"  placeholder="Filter String" required/></div>
                <span className='float-right'>
                <button> Add </button> </span>
            </form>
        )
    }   
}

export default AddFilterForm;