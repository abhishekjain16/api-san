import React from 'react';
import { KeyInput, ValueInput } from './inputs';

export const AddParamLink = ({ addParam }) => {
  return <a href="" onClick={event => addParam(event)} className="devise-links"> Add Parameter </a>;
};

export const Params = ({ params, addParam, handleParamChange, removeParam }) => {
  if (!params || !params.length) {
    return <span />;
  }
  return (
    <div className="form-group">
      <div className="form-group__label">
        Request Params
        <AddParamLink addParam={addParam} />
      </div>
      {
        params.map((param) => {
          return <RequestParameterInput key={param.id} removeParam={event => removeParam(event, param.id)} handleParamChange={event => handleParamChange(event, param.id)} param={param} />;
        })
      }
    </div>
  );
};

const RequestParameterInput = ({ removeParam, handleParamChange, param }) => {
  return (
    <div className="api-req-form__form-inline form-inline">
      <KeyInput inputKeyName="request_parameters[][key]" handleKeyChange={handleParamChange} value={param.key} />
      <ValueInput inputValueName="request_parameters[][value]" handleValueChange={handleParamChange} value={param.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeParam}>
        <span />
      </a>
    </div>
  );
};
