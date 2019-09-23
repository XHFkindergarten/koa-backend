const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const key = require('../config/default').secureOrKey

// 将token和key放入option对象
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // 获取请求得到的token
opts.secretOrKey = key; // token的key值

// 引入sql相关组件
const User = require('../models/UserModel')

module.exports = passport=>{
  // 在passport组件中注册jwt策略
  passport.use(
      new JwtStrategy(opts, async function(jwt_payload, done) {
      // 此时的jwt_payload是token被解析后得到的信息
      // console.log(jwt_payload)
      const user = await User.findOne({
        where: {
          id: jwt_payload.id
        }
      })
      console.log("id:"+jwt_payload.id)
      console.log(user)
      if(user) {
        return done(null,user)
      } else {
        return done(null,false)
      }
}));
}