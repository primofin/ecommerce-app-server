import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'

import User from '../models/User'
import { GOOGLE_ID, GOOGLE_SECRET } from '../util/secrets'

const GoogleStrategy = passportGoogle.Strategy

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

/**
 *
 * --------------Authenticate using GOOGLE service----------------
 *
 **/
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: '/api/v1/auth/google/redirect',
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      //check if user already exists in our db with the given profile ID
      let gAvatar = ''
      if (profile.photos) {
        gAvatar = profile.photos[0].value
      }
      let email = ''
      if (profile.emails) {
        email = profile.emails[0].value
      }
      let firstName = ''
      if (profile.name?.givenName) {
        firstName = profile.name?.givenName
      }
      let lastName = ''
      if (profile.name?.familyName) {
        lastName = profile.name?.familyName
      }
      const personalEmails = [
        'vynguyen9699@gmail.com',
        'vy.nguyen@integrify.io',
      ]
      const isPersonalEmail = personalEmails.includes(email)
      User.findOne({
        $or: [
          { 'google.id': profile.id },
          {
            email: email,
          },
        ],
      }).then((user) => {
        if (user) {
          //if we already have a record with the given profile ID
          done(undefined, user)
        } else {
          const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            avatar: gAvatar,
            email: email,
            isAdmin: isPersonalEmail,
            google: {
              id: profile.id,
              name: profile.displayName,
            },
          })
          newUser.save().then((newUser) => {
            done(undefined, newUser)
          })
        }
      })
    }
  )
)

export default passport
