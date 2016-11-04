class AddUsernameAndPasswordToApiResponse < ActiveRecord::Migration[5.0]
  def change
    add_column :api_responses, :username, :string
    add_column :api_responses, :password, :string
  end
end
