namespace :assets do
  task :clear_tmp do
    on release_roles(fetch(:assets_roles)) do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, "tmp:cache:clear"
        end
      end
    end
  end
end
