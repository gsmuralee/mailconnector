import React from 'react';

const Filter = ({name, dsAlias, dimension, filterString, removeColor=f=>f}) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{dsAlias}</td>
            <td>{dimension}</td>
            <td>{filterString}</td>
        </tr>
    )
}

export default Filter;