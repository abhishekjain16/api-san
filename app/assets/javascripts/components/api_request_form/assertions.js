import React from 'react';
import { KeyInput, ValueInput } from './inputs';

export const AddAssertionLink = ({ addAssertion }) => {
  return <a href="" onClick={event => addAssertion(event)} className="devise-links"> Add Assertion </a>;
};

export const Assertions = ({ assertions, addAssertion, handleAssertionChange, removeAssertion }) => {
  if (!assertions || !assertions.length) {
    return <span />;
  }
  return (
    <div className="form-group">
      <div className="form-group__label">
        Assertions
        <AddAssertionLink addAssertion={addAssertion} />
      </div>
      {
        assertions.map((assertion) => {
          return <RequestAssertionInput key={assertion.id} removeAssertion={event => removeAssertion(event, assertion.id)} handleAssertionChange={event => handleAssertionChange(event, assertion.id)} assertion={assertion} />;
        })
      }
    </div>
  );
};

const RequestAssertionInput = ({ removeAssertion, handleAssertionChange, assertion }) => {
  const shouldNotAllowAssertionValue = (assertion.kind === 'Status Code');
  return (
    <div className="api-req-form__form-inline form-inline">
      <AssertionKindInput inputKeyName="request_assertions[][kind]" handleKindChange={handleAssertionChange} value={assertion.kind} />
      <KeyInput inputKeyName="request_assertions[][key]" handleKeyChange={handleAssertionChange} value={shouldNotAllowAssertionValue ? '--' : assertion.key} disabled={shouldNotAllowAssertionValue} />
      <AssertionComparisonInput inputKeyName="request_assertions[][comparison]" handleComparisonChange={handleAssertionChange} value={assertion.comparison} />
      <ValueInput inputValueName="request_assertions[][value]" handleValueChange={handleAssertionChange} value={assertion.value} />
      <a href="" className="fa fa-2x fa-times api-req-form__remove-icon" onClick={removeAssertion}>
        <span />
      </a>
    </div>
  );
};

const AssertionKindInput = ({ inputKindName, handleKindChange, value }) => {
  return (
    <select name={inputKindName} className="api-req-form__assertion-select form-control required" value={value} onChange={handleKindChange} data-type="kind">
      <option>Response JSON</option>
      <option>Status Code</option>
    </select>
  );
};

const AssertionComparisonInput = ({ inputComparisonName, handleComparisonChange, value }) => {
  return (
    <select name={inputComparisonName} className="api-req-form__assertion-select form-control required" value={value} onChange={handleComparisonChange} data-type="comparison">
      <option>equals</option>
      <option>contains</option>
      <option>greater than</option>
      <option>lesser than</option>
    </select>
  );
};
