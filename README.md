# Uniswap Clone

This project is a clone of [Build Uniswap Blockchain Web 3.0 App with Solidity](https://www.youtube.com/watch?v=xXxjRzdYIss). The smart contract is build with Python [Brownie](https://eth-brownie.readthedocs.io/en/stable/) Framework.

It mainly serves as private notes.

**Tech-Stack**:

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Sanity](https://www.sanity.io/get-started)
- [Brownie](https://eth-brownie.readthedocs.io/en/stable/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.11/)

## Prerequisits

- [MetaMask](https://metamask.io/)
- [Infura](https://infura.io/)

## Setup Local Development Environment

Manjaro Linux 21.2.3

### Smart Contract

**Recommended**: Python 3.8.12, Pipenv

Initialize a virtual environement with pipenv

```bash
pipenv install eth-brownie --python 3.8
pipenv shell
```

Initialize Brownie project with `brownie init smart-contract`. Create the contract file `Transactions.sol` in the `contracts` folder.

```sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Transactions {
    event Transfer(
        address sender,
        address receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );

    function publishTransaction(
        address payable receiver,
        uint256 amount,
        string memory message,
        string memory keyword
    ) public {
        emit Transfer(
            msg.sender,
            receiver,
            amount,
            message,
            block.timestamp,
            keyword
        );
    }
}
```

Alternativly setup from Pipfile

Git clone the repository and cd into the directory. Then run

```
pipenv install
```

Or setup with virtualenv

Refer to [Simple Storage](https://github.com/DennisKasper/brownie-simple-storage) example.

### Client

**Recommended**: Node v17.3.0, Yarn v1.22.17

Create a Next.js project with [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)

```bash
yarn create next-app client --typescript
```

Setup tailwindcss

```bash
yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest && npx tailwindcss init -p
```

Modify `tailwind.config.js` according to the [installation guide](https://tailwindcss.com/docs/guides/nextjs) and `import 'tailwindcss/tailwind.css'` in `_app.tsx`.

Install dependencies

```bash
yarn add ethers react-icons @sanity/client react-modal @emotion/react react-spinners
```

## Getting Started

Cd into the `smart-contract` folder and compile the contract with `brownie compile`.

Create a `brownie-config.yaml` in that directory with

```yaml
dotenv: .env
wallets:
  from_key: ${PRIVATE_KEY}
```

and a `.env` file with

```bash
PRIVATE_KEY=private_key
WEB3_INFURA_PROJECT_ID=infura_project_id
```

and a `deploy.py` script in the `scripts` folder with

```python
from brownie import accounts, config, network, Transactions


def get_account():
    if network.show_active() == 'development': return accounts[0]
    return accounts.add(config['wallets']['from_key'])


def main():
    account = get_account()
    Transactions.deploy({'from': account})
```

Then deploy the smart contract to the Rinkeby (ETH) testnet with `brownie run scripts/deploy.py --network rinkeby`.

## Resources

[Curve's Brownie Tutorial](https://github.com/curvefi/brownie-tutorial)  
[Brownie Mixes](https://github.com/brownie-mix)  
[Pipenv](https://pipenv-fork.readthedocs.io/en/latest/index.html)  
[Youtube Video](https://www.youtube.com/watch?v=xXxjRzdYIss)
