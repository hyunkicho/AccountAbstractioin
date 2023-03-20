# Address Abstraction

1. SimpleAccountsFactory Deploy

```
npx hardhat run scripts/deploy/deploySimpleAccounts.ts --network matic
```
/==SimpleAccountFactory addr= 0x80db4661A8dB53b409Ace7967cb9Ba7B4c616c0f

2. ERC20 deploy

```
npx hardhat run scripts/deploy/deployTestToken.ts --network matic
```

3. mint ERC20 Token
```
npx hardhat run scripts/mintToken.ts --network matic    
```

4. create Account
   
```
npx hardhat run scripts/paymaster/createAccount.ts --network matic   
```