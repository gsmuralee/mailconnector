import React from 'react';

const Filter = ({name, dsAlias, dimension, filterString, onEdit=f=>f, onDelete=f=>f}) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{dsAlias}</td>
            <td>{dimension}</td>
            <td>{filterString}</td>
            <td>
                <span className="glyphicon glyphicon-pencil" aria-hidden="true" onClick={onEdit}></span>

                <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={onDelete}></span>
            </td>
        </tr>
    )
}

export default Filter;