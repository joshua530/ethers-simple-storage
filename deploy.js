"use strict"

require("dotenv").config()
const ethers = require("ethers")
const fs = require("fs")

// Promise: pending, fulfilled, rejected
async function main() {
  // RPC = Remote Procedure Call
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL // rpc address
  )
  // // use encrypted json key to instantiate wallet
  // const encryptedJsonKey = fs.readFileSync("./.encryptedJsonKey.json", "utf-8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJsonKey,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = await wallet.connect(provider);

  // use private key to instantiate wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  // get abi and binary from compiled files
  // abi => application binary interface[a contract's API :)]
  // binary => compiled contract
  const abi = fs.readFileSync(
    "./compiled/SimpleStorage_sol_SimpleStorage.abi",
    "utf8"
  )
  const binary = fs.readFileSync(
    "./compiled/SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )
  // contract factory => an object that can be used to deploy contracts
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")
  const contract =
    await contractFactory.deploy(/*{extra info like gas limit goes here}*/)
  // Receipt - what you get when you wait for a transaction to complete
  // Response - what you get when you create a transaction (kind of a promise)
  // wait for one block confirmation to ensure our transaction is already added to a block
  const transactionReceipt = await contract.deployTransaction.wait(1)
  console.log(`Contract address: ${contract.address}`)

  // make calls to the contract
  // retrieve is a view function hence no gas will be spent in this call
  const currentFavNumber = await contract.retrieve()
  console.log(`Current favorite number: ${currentFavNumber.toString()}`)

  // store will cost gas, it is a contract function
  const updateFavNumResponse = await contract.store(4)
  const updateFavNumReceipt = await updateFavNumResponse.wait(1)
  const updatedFavNum = await contract.retrieve()
  console.log(`Updated fav number: ${updatedFavNum}`)

  // --- insert demos here ---
  // console.log("Deployment transaction(transaction response):");
  // console.log(contract.deployTransaction);
  // console.log("Transaction receipt:");
  // console.log(transactionReceipt);
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => console.log(e))
