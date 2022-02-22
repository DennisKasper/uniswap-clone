import { createContext, FC, useContext, useState, useEffect } from 'react'
import { contractABI, contractAddress } from '../lib/constants'
import { ethers } from 'ethers'
import { client } from '../lib/sanityClient'
import { useRouter } from 'next/router' 

export interface TransactionContext {
  currentAccount: string,
  connectWallet: () => Promise<void>,
  sendTransaction: (metamask: any, connectedAccount: string) => void,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void,
  formData: {
    addressTo: string;
    amount: string;
  },
  isLoading: boolean,
}

const TransactionContextImp = createContext<TransactionContext>(null!)

export function useTransaction() {
  return useContext(TransactionContextImp)
}


let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}


function getEthereumContract() {
  const provider = new ethers.providers.Web3Provider(eth)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  )

  return transactionContract
}


export const TransactionProvider: FC = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: ''
  })
  const router = useRouter()

  async function connectWallet(metamask = eth) {
    try {
      if (!metamask) return alert('Please install MetaMask')

      const accounts = await metamask.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (error: any) {
      if (error?.code === 4001) return
      throw new Error('No ethereum object')
    }
  }

  async function checkIfWalletIsConnected(metamask = eth) {
    try {
      if (!metamask) return alert('Please install MetaMask')

      const accounts = await metamask.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])
        console.log('wallet is already connected')
      }
    } catch (error) {
      console.log(error)
      throw new Error('No ethereum object')
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])


  useEffect(() => {
    if (!currentAccount) return
    (async () => {
      const userDoc = {
        _type: 'users',
        _id: currentAccount,
        userName: 'Unnamed',
        address: currentAccount,
      }

      await client.createIfNotExists(userDoc)
    })()
  }, [currentAccount])


  async function sendTransaction(metamask = eth, connectedAccount = currentAccount) {
    if (!metamask) return alert('Please install MetaMask')

    try {
      const { addressTo, amount } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x7ef40',  // 520000 Gwei
            value: parsedAmount._hex
          }
        ]
      })

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transfering ETH ${parsedAmount} tp ${addressTo}`,
        'TRANSFER'
      )

      setIsLoading(true)

      await transactionHash.wait()

      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      )

      setIsLoading(false)
      setFormData({ addressTo: '', amount: '' })
    } catch (error) {
      console.log(error)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, name: string): void {
    setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
  }

  async function saveTransaction(
    txHash: string,
    amount: string,
    fromAddress: string = currentAccount,
    toAddress: string,
  ) {
    const txDoc = {
      _type: 'transactions',
      _id: txHash,
      fromAddress: fromAddress,
      toAddress: toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash: txHash,
      amount: parseFloat(amount),
    }

    await client.createIfNotExists(txDoc)

    await client
      .patch(currentAccount)
      .setIfMissing({ transactions: [] })
      .insert('after', 'transactions[-1]', [
        {
          _key: txHash,
          _ref: txHash,
          _type: 'reference',
        },
      ])
      .commit()

    return
  }

  useEffect(() => {
    if (isLoading) {
      router.push(`/?loading=${currentAccount}`)
    } else {
      router.push(`/`)
    }
  }, [isLoading])

  
  return (
    <TransactionContextImp.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
        isLoading,
      }}
    >
      {children}
    </TransactionContextImp.Provider>
  )
}
