class AddRequestHeadersToApiResponse < ActiveRecord::Migration[5.0]
  def change
    add_column :api_responses, :request_headers, :hstore, default: {}
  end
end
