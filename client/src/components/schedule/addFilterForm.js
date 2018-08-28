import React from 'react';

const AddFilterForm = ({enabled, onNewFilter=f=>f}) => {
    let name, dsAlias, dimension, filterString;
    const submit = (e) => {
        e.preventDefault();
        onNewFilter(name.value, dsAlias.value, dimension.value, filterString.value);
        name.value='';dsAlias.value=''; dimension.value=''; filterString.value='';
    }
    if(!enabled) return ''
    return (
        <form onSubmit={submit}>
            <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
            <input className="form-control" ref={input => name = input} type="text" placeholder="Name" required/> </div>
            <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
            <input className="form-control" ref={input => dsAlias = input} type="text" placeholder="DS Alias" required/> </div>
            <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
            <input className="form-control" ref={input => dimension = input} type="text"  placeholder="Dimension" required/></div>
            <div className='col-sm-12 col-md-12 form-group input-group zero-margin  no-padding'>
            <input className="form-control" ref={input => filterString = input} type="text"  placeholder="Filter String" required/></div>
            <span className='float-right'>
            <button> Add </button> </span>
        </form>
    )
}

export default AddFilterForm;