from brownie import accounts, config, network, Transactions


def get_account():
    if network.show_active() == 'development': return accounts[0]
    return accounts.add(config['wallets']['from_key'])


def main():
    account = get_account()
    Transactions.deploy({'from': account})
