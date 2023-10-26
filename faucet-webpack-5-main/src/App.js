import './App.css';
import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contract';

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      // with metamask we have access to window.ethereum & to window.web3
      // metamask injects a global API into website
      // this API will allow website to request users, accounts, read data to blockchain
      // can also sign messages and transactions

      const provider = await detectEthereumProvider()
      const contract = await loadContract('Faucet', provider)

      if(provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
        console.error('Please install Metamask')
      }
    }

    loadProvider ()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  return (
    <>
      <div className = 'faucet-wrapper'>
        <div className = 'faucet'>
          <div className = 'is-flex is-align-items-center'>
            <span>
              <strong className = 'mr-2'>Account: </strong>
            </span>
            
              {account ? 
              <div>{account}</div>:
              <button
              className = 'button is-small'
              onClick = {() => web3Api.provider.request({method: 'eth_requestAccounts'}
              )}
              >
                Connect Wallet
              </button>
              }
          </div>
          <div className = 'balance-view is-size-2 my-4'>
            Current Balance: <strong>10</strong> ETH
          </div>
          
          <button className = 'button is-link mr-2'>Donate</button>
          <button className = 'button is-primary is-dark'>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
