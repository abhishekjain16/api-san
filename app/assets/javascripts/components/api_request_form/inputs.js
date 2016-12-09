import React from 'react';

export const KeyInput = ({ inputKeyName, handleKeyChange, value, disabled }) => {
  return (
    <input type="text" value={value} name={inputKeyName} className="input form-control api-req-form__input" placeholder="Enter Name" onChange={handleKeyChange} data-type="key" disabled={disabled} />
  );
};

export const ValueInput = ({ inputValueName, handleValueChange, value }) => {
  return (
    <input type="text" value={value} name={inputValueName} className="input form-control api-req-form__input" placeholder="Enter Value" onChange={handleValueChange} data-type="value" />
  );
};

export const SelectForMethods = ({ handleChange, defaultMethod }) => {
  return (
    <select className="form-control required" name="method" defaultValue={defaultMethod.toLowerCase()} onChange={handleChange}>
      <option value="get">GET</option>
      <option value="post">POST</option>
      <option value="put">PUT</option>
      <option value="patch">PATCH</option>
      <option value="delete">Delete</option>
    </select>
  );
};
