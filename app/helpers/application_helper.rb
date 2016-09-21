module ApplicationHelper

  def super_admin_signed_in?
    user_signed_in? && current_user.super_admin?
  end

  def nav_link text, path, condition = false, options = {}
    class_name = (current_page?(path) || condition) ? 'active' : ''

    content_tag(:li, class: class_name) do
      options[:title] = text unless options.has_key?(:title)
      link_to text, path, options
    end
  end

  def react_component(name, props = {}, options = {}, &block)
    options = {:tag => options} if options.is_a?(Symbol)
    html_options = options.reverse_merge(:data => {})
    html_options[:data].tap do |data|
      data[:integration_name] = 'react-component'
      data[:react_class] = name
      data[:react_props] = (props.is_a?(String) ? props : props.to_json)
    end
    html_tag = html_options[:tag] || :div

    # remove internally used properties so they aren't rendered to DOM
    html_options.except!(:tag)

    content_tag(html_tag, '', html_options, &block)
  end

  private

  def camelize_props_key(props)
    return props unless props.is_a?(Hash)
    props.inject({}) do |h, (k,v)|
      h[k.to_s.camelize(:lower)] = v.is_a?(Hash) ? camelize_props_key(v) : v; h
    end
  end

end
