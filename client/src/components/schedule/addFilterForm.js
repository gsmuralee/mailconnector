import React from 'react';

const AddFilterForm = ({onNewFilter=f=>f}) => {
    let name, dsAlias, dimension, filterString;
    const submit = (e) => {
        e.preventDefault();
        onNewFilter(name.value, dsAlias.value, dimension.value, filterString.value);
        name.value='';dsAlias.value=''; dimension.value=''; filterString.value='';
    }

    return (
        <form onSubmit={submit}>
            <div>
            <input ref={input => name = input} type="text" placeholder="Name" required/> </div>
            <div>
            <input ref={input => dsAlias = input} type="text" placeholder="DS Alias" required/> </div>
            <div>
            <input ref={input => dimension = input} type="text"  placeholder="Dimension" required/></div>
            <div>
            <input ref={input => filterString = input} type="text"  placeholder="Filter String" required/></div>
            <div>
            <button> Add </button> </div>
        </form>
    )
}

export default AddFilterForm;