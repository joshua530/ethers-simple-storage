const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASS,
    process.env.PRIVATE_KEY
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync("./.encryptedJsonKey.json", encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })