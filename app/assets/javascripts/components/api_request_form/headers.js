import React from 'react';
import { KeyInput, ValueInput } from './inputs';

export const AddHeaderLink = ({ addHeader }) => {
  return <a href="" onClick={event => addHeader(event)} className="devise-links"> Add Header </a>;
};

export const Headers = ({ headers, addHeader, handleHeaderChange, removeHeader }) => {
  if (!headers || !headers.length) {
    return <span />;
  }
  return (
    <div className="form-group">
      <div className="form-group__label">
        Headers
        <AddHeaderLink addHeader={addHeader} />
      </div>
      {
        headers.map((header) => {
          return <RequestHeaderInput key={header.id} removeHeader={event => removeHeader(event, header.id)} handleHeaderChange={event => handleHeaderChange(event, header.id)} header={header} />;
        })
      }
    </div>
  );
};

const RequestHeaderInput = ({ removeHeader, handleHeaderChange, header }) => {
  return (
    <div className="api-req-form__form-inline form-inline">
      <KeyInput inputKeyName="request_headers[][key]" handleKeyChange={handleHeaderChange} value={header.key} />
      <ValueInput inputValueName="request_headers[][value]" handleValueChange={handleHeaderChange} value={header.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeHeader}>
        <span />
      </a>
    </div>
  );
};

