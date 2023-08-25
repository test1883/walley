const Password = require('./passwordModel')

const getPassword = async (req, res) => {
  const { tokenId, password } = req.body

  try {
    const check = await Password.get(tokenId, password)

    res.status(200).json({check})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const addPassword = async (req, res) => {
  const {tokenId, password} = req.body

  try {
    const user = await Password.add(tokenId, password)

    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { addPassword, getPassword }