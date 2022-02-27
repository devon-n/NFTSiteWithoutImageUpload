import { ethers } from 'ethers'
import { useState } from 'react'
import {create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Image from '../components/Image'
import { nftaddresses, symbols } from '../config'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import NFT from './contracts/NFT.json'


export default function CreateItem () {
    const [fileUrl, setFileUrl] = useState(null) // Set state to null
    const [formInput, updateFormInput] = useState({ name: '', description: '', attribute: ''})
    const router = useRouter()




    async function createItem() {


        try {
            mint(name, description, attribute, url) // function to create sale with url
        } catch {
            console.log("There was a problem")
        }
    }

    async function mint() {
        const web3Modal = new Web3Modal() // get web3modal
        const connection = await web3Modal.connect() // connect using web3
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() // get signer

        try {
            // Get connection and chain Id
            const network = await provider.getNetwork()
            const chainId = network['chainId']

            // Get Contract Address
            let contractAddress = nftaddresses[chainId]
            const tokenContract = new ethers.Contract(contractAddress, NFT.abi, signer) // get token contract

            
            // Send transaction
            let transaction = await tokenContract.mint()
            await transaction.wait() // wait for transaction
            router.push('/your-funds')
        } catch (err) {
            console.log(err.code)
            if(err.code !== 4001){
                alert("Error: Contract not found. Please change your network to one with our NFTs. You can find them on our home page")
            }
        }

    }

    return (
        <div className="flex justify-center px-5 pt-16 mx-auto md:pt-0 font-roboto">
            <div className="flex flex-col w-1/2 pb-12">
                <p className="m-10">Here you can mint your own NFT</p>
                <button
                    onClick={createItem}
                    className="w-full p-2 font-bold text-white bg-orange-500 rounded shadow-lg md:w-1/2"
                >
                    Mint
                </button>
            </div>
        </div>
    )

}