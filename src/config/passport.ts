import passport from 'passport'
import passportLocal from 'passport-local'
import passportFacebook from 'passport-facebook'

import User from '../models/User'
import { validPassword } from '../helpers/password'

const LocalStrategy = passportLocal.Strategy
const FacebookStrategy = passportFacebook.Strategy

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use(
  new LocalStrategy({ usernameField: 'username' }, function (
    username,
    password,
    cb
  ) {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return cb(null, false)
        }
        const isValid = validPassword(password, user.hash, user.salt)
        if (isValid) {
          return cb(null, user)
        } else {
          return cb(null, false)
        }
      })
      .catch((err) => {
        cb(err)
      })
  })
)
export default passport
