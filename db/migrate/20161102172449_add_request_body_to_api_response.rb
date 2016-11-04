class AddRequestBodyToApiResponse < ActiveRecord::Migration[5.0]
  def change
    add_column :api_responses, :request_body, :text
  end
end
