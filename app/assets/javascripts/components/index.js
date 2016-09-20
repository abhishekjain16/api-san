import ReactDOM from 'react-dom';
import React from 'react';
import ApiRequestForm from 'components/api_request_form'
import ApiResponse from 'components/api_response'

class ApiRadar {
  constructor(){
    this.components = {}
    this.registerComponent('ApiRequestForm', ApiRequestForm);
    this.registerComponent('ApiResponse', ApiResponse);
  }

  registerComponent(name, component){
    this.components[name] = component;
  }

  loadReactComponents() {
    $("[data-integration-name='react-component']").each((i, element) => {
      const _element = $(element),
        componentName = _element.data('react-class'),
        payload = _element.data('react-props');
      ReactDOM.render(
        React.createElement(this.components[componentName], payload),
        element
      );
    });

  }
}
$(() => {
  const api_radar = new ApiRadar;
  api_radar.loadReactComponents();
});
