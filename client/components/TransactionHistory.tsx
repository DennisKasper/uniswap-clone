import { useEffect, useState } from 'react'
import { client } from '../lib/sanityClient'
import { useTransaction } from '../contexts/transaction.context'
import Image from 'next/image'
import { FiArrowUpRight } from 'react-icons/fi'

const styles = {
  wrapper: `h-full text-white select-none h-full w-screen flex-1 pt-14 flex items-end justify-end pb-12 overflow-scroll px-8`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
}

const TransactionHistory = () => {
  const { isLoading, currentAccount } = useTransaction()
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      if (!isLoading && currentAccount) {
        const query = `
          *[_type=="users" && _id == "${currentAccount}"] {
            "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
          }
        `

        const clientRes = await client.fetch(query)

        setTransactionHistory(clientRes[0].transactionList)
      }
    })()
  }, [isLoading, currentAccount])

  return (
    <div className={styles.wrapper}>
      <div>
        {transactionHistory &&
          transactionHistory?.map((transaction, index) => (
            <div className={styles.txHistoryItem} key={index}>
              <div className={styles.txDetails}>
                <Image src='/ethCurrency.png' height={20} width={15} alt='eth' />
                {transaction.amount} Ξ sent to{' '}
                <span className={styles.toAddress}>
                  {transaction.toAddress.substring(0, 6)}...
                </span>
              </div>{' '}
              on{' '}
              <div className={styles.txTimestamp}>
                {new Date(transaction.timestamp).toLocaleString('en-US', {
                  timeZone: 'PST',
                  hour12: true,
                  timeStyle: 'short',
                  dateStyle: 'long',
                })}
              </div>
              <div className={styles.etherscanLink}>
                <a
                  href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
                  target='_blank'
                  rel='noreferrer'
                  className={styles.etherscanLink}
                >
                  View on Etherscan
                  <FiArrowUpRight />
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TransactionHistory