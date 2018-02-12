# [MO] Import certificates into Match *(~30 min)*

## Owner: [Louis Lagrange](https://github.com/Minishlink)

When using Fastlane's [Match](https://github.com/fastlane/fastlane/tree/master/match), you might want to update the certificates
or provisioning profiles manually if you don't have enough rights on the publisher's Apple developer account
(meaning that you're unable to create certificates and provisioning profile by your own or by using match).

## Prerequisites *(~10 min)*

* A `.p12` distribution certificate and its password, say `cert.p12`
* A `.mobileprovision` provisioning profile, say `profile.mobileprovision`
* An Apple developer account that has read access to the publisher's Apple developer account (check by [logging in](https://developer.apple.com/account/))
* Write access to the Match git repo, say `certificates.git`
* The app's bundle identifier: `BUNDLE_IDENTIFIER`
* A `list_certificates` lane in your `Fastfile`:

```ruby
import fastlane_require 'spaceship'

# ...

platform :ios do
  lane :list_certificates do
    Spaceship.login
    Spaceship.select_team
    
    Spaceship.certificate.all.each do |cert|
      cert_type = Spaceship::Portal::Certificate::CERTIFICATE_TYPE_IDS[cert.type_display_id].to_s.split("::")[-1]
      puts "Cert id: #{cert.id}, name: #{cert.name}, expires: #{cert.expires.strftime("%Y-%m-%d")}, type: #{cert_type}"
    end
  end
# ...
```

## Steps *(~20 min)*

1. Install the distribution certificate in your `Keychain` (double click)
2. In your `Keychain`, under "My certificates", export the certificate in the `.cer` format (right click), say `cert.cer`
3. Find the new distribution certificate's ID
    1. Run `bundle exec fastlane ios list_certificates` with the account that has access to the publisher's Apple developer account
    2. Find the line corresponding to the new distribution certificate and note the certificate ID `CERT_ID`
4. Extract the private key from `cert.p12`: `openssl pkcs12 -nocerts -nodes -out cert.pem -in cert.p12`
5. Open `cert.pem` in a text editor and make sure it starts with `-----BEGIN RSA PRIVATE KEY-----`. If it's the case, go directly to **7**.
6. Convert the private key to a RSA private key: `openssl rsa -in cert.pem -out cert.pem`
7. Find the password of the Match git repo's branch (`MATCH_PASSWORD`) in your secret files
8. Cypher the private key with the Match algorithm: `openssl aes-256-cbc -k ${MATCH_PASSWORD} -in cert.pem -out ${CERT_ID}.p12 -a`
9. Cypher the public key: `openssl aes-256-cbc -k ${MATCH_PASSWORD} -in cert.cer -out ${CERT_ID}.cer -a`
10. Cypher the provisioning profile: `openssl aes-256-cbc -k ${MATCH_PASSWORD} -in profile.mobileprovision -out AppStore_${BUNDLE_IDENTIFIER}.mobileprovision -a`
11. Clone the Match git repository.
12. Checkout the `MATCH_GIT_BRANCH`.
13. Remove the old certificates and provisioning profiles and add the new ones.
