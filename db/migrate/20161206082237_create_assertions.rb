class CreateAssertions < ActiveRecord::Migration[5.0]
  def change
    create_table :api_assertions do |t|

      t.string :key
      t.string :value
      t.string :comparison
      t.string :kind
      t.string :api_value
      t.boolean :success, default: false
      t.references :api_response
      t.timestamps
    end
  end
end
