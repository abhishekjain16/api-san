class ApiResponse < ApplicationRecord
  has_secure_token
  validates :url, :method, presence: true
end
