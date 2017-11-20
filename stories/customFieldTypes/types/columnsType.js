import React from 'react';
import {GenField} from '../../../src';

const ColumnsComponent = ({field, visible, path, gen}) => (
  <div className='row -sm-space-between'>
    {field.columns.map((fields, colIndex) => (
      <div className='col-sm' key={colIndex}>
        {fields.map((colField, fieldIndex) => (
          <GenField
            key={fieldIndex}
            {...{field: colField, visible, path: `${path}.columns[${colIndex}][${fieldIndex}]`}}
          />
        ))}
      </div>
    ))}
  </div>
);

export const columnsType = ({field}) => ({
  _genComponent: ColumnsComponent,
  _genChildren: field.columns.reduce((children, column) => [...children, ...column], [])
});

export default columnsType;
