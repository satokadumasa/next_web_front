■ Deploy Project

```bash
git clone https://github.com/satokadumasa/next_web_front.git
cd next_web_front

# edit your environment variable.
vi .env.local

yarn install
yarn dev
```
Use with weed_api(https://github.com/satokadumasa/next_web__api)


■ create or edit session_store.rb
```bash
$> vi config/initializers/session_store.rb

if Rails.env === 'production'
  Rails.application.config.session_store :cookie_store, key: '_auth-app-api', domain: 'www.hogehoge.com'
else
  Rails.application.config.session_store :cookie_store, key: '_auth-app-api', domain: 'next_front.example.com'
end
```
