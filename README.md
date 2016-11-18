[![CircleCI](https://circleci.com/gh/bigbinary/apisanity/tree/master.svg?style=svg&circle-token=bf02c79488ee7343d9f7e7c43f93825d5584cc65)](https://circleci.com/gh/bigbinary/apisanity/tree/master)

#### Setup

```
bundle install
cp config/database.yml.postgresqlapp config/database.yml
rake setup
npm install
bundle exec rails server
```

#### Configuration for Heroku Review Apps

- For branches auto deployed using `Heroku Review Apps` you need to env mentioned in app.json as `required` on the 
parent app in the `settings` tab. Only exception is `ENV['HEROKU_APP_NAME']`, this is set by heroku.

#### Configuration for Heroku(no review apps)

- Set necessary environment variables.
- Set `ENV['HEROKU']` as true, used to determine that we are deploying to heroku and helps with config rails accordingly. 
- Add `heroku-postgresql` addon to the app.
- Add following buildpacks. First is use to run `npm install` and second for `bundle install`

```
$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git
$ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby.git
```
 
#### Steps to take care before merging to master.

- Install Heroku Repo Plugin from [here](https://github.com/heroku/heroku-repo#installation)
- Run `heroku repo:purge_cache -a apisanity`
- Merge to master.

This would help in deploying to master when PR is merged without any hassle.

- If PR is merged and deployment failed, run `heroku repo:purge_cache -a apisanity`
and then deploy master again via [Dashboard on Heroku](https://dashboard.heroku.com/apps/apisanity/deploy/github)
using manual deploy.

