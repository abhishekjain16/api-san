set :stage, :staging
set :branch, 'staging'
set :tmp_dir, '/data/tmp'

# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server
# definition into the server list. The second argument
# something that quacks like a has can be used to set
# extended properties on the server.
server '67.205.175.155',
       user: 'deployer',
       roles: %w{web app db},
       ssh_options: {:user=>"deployer", :auth_methods=>["publickey"], :forward_agent=>true}

set :rails_env, :staging
fetch(:default_env).merge!(rails_env: :staging)

after 'deploy:finished', 'git:release:tag'
