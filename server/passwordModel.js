const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const passwordSchema = new Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

passwordSchema.statics.add = async function(tokenId, password) {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ tokenId, password: hash })

  return user
}

passwordSchema.statics.get = async function(tokenId,password) {
    const user = await this.findOne({tokenId})
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return false
    }

    return true
}

module.exports = mongoose.model('Password', passwordSchema)