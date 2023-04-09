import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './ctoken.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    AccrueInterest: new LogEvent<([cashPrior: ethers.BigNumber, interestAccumulated: ethers.BigNumber, borrowIndex: ethers.BigNumber, totalBorrows: ethers.BigNumber] & {cashPrior: ethers.BigNumber, interestAccumulated: ethers.BigNumber, borrowIndex: ethers.BigNumber, totalBorrows: ethers.BigNumber})>(
        abi, '0x4dec04e750ca11537cabcd8a9eab06494de08da3735bc8871cd41250e190bc04'
    ),
    Approval: new LogEvent<([owner: string, spender: string, amount: ethers.BigNumber] & {owner: string, spender: string, amount: ethers.BigNumber})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Borrow: new LogEvent<([borrower: string, borrowAmount: ethers.BigNumber, accountBorrows: ethers.BigNumber, totalBorrows: ethers.BigNumber] & {borrower: string, borrowAmount: ethers.BigNumber, accountBorrows: ethers.BigNumber, totalBorrows: ethers.BigNumber})>(
        abi, '0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80'
    ),
    Failure: new LogEvent<([error: ethers.BigNumber, info: ethers.BigNumber, detail: ethers.BigNumber] & {error: ethers.BigNumber, info: ethers.BigNumber, detail: ethers.BigNumber})>(
        abi, '0x45b96fe442630264581b197e84bbada861235052c5a1aadfff9ea4e40a969aa0'
    ),
    LiquidateBorrow: new LogEvent<([liquidator: string, borrower: string, repayAmount: ethers.BigNumber, mTokenCollateral: string, seizeTokens: ethers.BigNumber] & {liquidator: string, borrower: string, repayAmount: ethers.BigNumber, mTokenCollateral: string, seizeTokens: ethers.BigNumber})>(
        abi, '0x298637f684da70674f26509b10f07ec2fbc77a335ab1e7d6215a4b2484d8bb52'
    ),
    Mint: new LogEvent<([minter: string, mintAmount: ethers.BigNumber, mintTokens: ethers.BigNumber] & {minter: string, mintAmount: ethers.BigNumber, mintTokens: ethers.BigNumber})>(
        abi, '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f'
    ),
    NewAdmin: new LogEvent<([oldAdmin: string, newAdmin: string] & {oldAdmin: string, newAdmin: string})>(
        abi, '0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc'
    ),
    NewComptroller: new LogEvent<([oldComptroller: string, newComptroller: string] & {oldComptroller: string, newComptroller: string})>(
        abi, '0x7ac369dbd14fa5ea3f473ed67cc9d598964a77501540ba6751eb0b3decf5870d'
    ),
    NewImplementation: new LogEvent<([oldImplementation: string, newImplementation: string] & {oldImplementation: string, newImplementation: string})>(
        abi, '0xd604de94d45953f9138079ec1b82d533cb2160c906d1076d1f7ed54befbca97a'
    ),
    NewMarketInterestRateModel: new LogEvent<([oldInterestRateModel: string, newInterestRateModel: string] & {oldInterestRateModel: string, newInterestRateModel: string})>(
        abi, '0xedffc32e068c7c95dfd4bdfd5c4d939a084d6b11c4199eac8436ed234d72f926'
    ),
    NewPendingAdmin: new LogEvent<([oldPendingAdmin: string, newPendingAdmin: string] & {oldPendingAdmin: string, newPendingAdmin: string})>(
        abi, '0xca4f2f25d0898edd99413412fb94012f9e54ec8142f9b093e7720646a95b16a9'
    ),
    NewProtocolSeizeShare: new LogEvent<([oldProtocolSeizeShareMantissa: ethers.BigNumber, newProtocolSeizeShareMantissa: ethers.BigNumber] & {oldProtocolSeizeShareMantissa: ethers.BigNumber, newProtocolSeizeShareMantissa: ethers.BigNumber})>(
        abi, '0xf5815f353a60e815cce7553e4f60c533a59d26b1b5504ea4b6db8d60da3e4da2'
    ),
    NewReserveFactor: new LogEvent<([oldReserveFactorMantissa: ethers.BigNumber, newReserveFactorMantissa: ethers.BigNumber] & {oldReserveFactorMantissa: ethers.BigNumber, newReserveFactorMantissa: ethers.BigNumber})>(
        abi, '0xaaa68312e2ea9d50e16af5068410ab56e1a1fd06037b1a35664812c30f821460'
    ),
    Redeem: new LogEvent<([redeemer: string, redeemAmount: ethers.BigNumber, redeemTokens: ethers.BigNumber] & {redeemer: string, redeemAmount: ethers.BigNumber, redeemTokens: ethers.BigNumber})>(
        abi, '0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929'
    ),
    RepayBorrow: new LogEvent<([payer: string, borrower: string, repayAmount: ethers.BigNumber, accountBorrows: ethers.BigNumber, totalBorrows: ethers.BigNumber] & {payer: string, borrower: string, repayAmount: ethers.BigNumber, accountBorrows: ethers.BigNumber, totalBorrows: ethers.BigNumber})>(
        abi, '0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1'
    ),
    ReservesAdded: new LogEvent<([benefactor: string, addAmount: ethers.BigNumber, newTotalReserves: ethers.BigNumber] & {benefactor: string, addAmount: ethers.BigNumber, newTotalReserves: ethers.BigNumber})>(
        abi, '0xa91e67c5ea634cd43a12c5a482724b03de01e85ca68702a53d0c2f45cb7c1dc5'
    ),
    ReservesReduced: new LogEvent<([admin: string, reduceAmount: ethers.BigNumber, newTotalReserves: ethers.BigNumber] & {admin: string, reduceAmount: ethers.BigNumber, newTotalReserves: ethers.BigNumber})>(
        abi, '0x3bad0c59cf2f06e7314077049f48a93578cd16f5ef92329f1dab1420a99c177e'
    ),
    Transfer: new LogEvent<([from: string, to: string, amount: ethers.BigNumber] & {from: string, to: string, amount: ethers.BigNumber})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    _acceptAdmin: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe9c714f2'
    ),
    _addReserves: new Func<[addAmount: ethers.BigNumber], {addAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x3e941010'
    ),
    _reduceReserves: new Func<[reduceAmount: ethers.BigNumber], {reduceAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x601a0bf1'
    ),
    _setComptroller: new Func<[newComptroller: string], {newComptroller: string}, ethers.BigNumber>(
        abi, '0x4576b5db'
    ),
    _setImplementation: new Func<[implementation_: string, allowResign: boolean, becomeImplementationData: string], {implementation_: string, allowResign: boolean, becomeImplementationData: string}, []>(
        abi, '0x555bcc40'
    ),
    _setInterestRateModel: new Func<[newInterestRateModel: string], {newInterestRateModel: string}, ethers.BigNumber>(
        abi, '0xf2b3abbd'
    ),
    _setPendingAdmin: new Func<[newPendingAdmin: string], {newPendingAdmin: string}, ethers.BigNumber>(
        abi, '0xb71d1a0c'
    ),
    _setProtocolSeizeShare: new Func<[newProtocolSeizeShareMantissa: ethers.BigNumber], {newProtocolSeizeShareMantissa: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x83030846'
    ),
    _setReserveFactor: new Func<[newReserveFactorMantissa: ethers.BigNumber], {newReserveFactorMantissa: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0xfca7820b'
    ),
    accrualBlockTimestamp: new Func<[], {}, ethers.BigNumber>(
        abi, '0xcfa99201'
    ),
    accrueInterest: new Func<[], {}, ethers.BigNumber>(
        abi, '0xa6afed95'
    ),
    admin: new Func<[], {}, string>(
        abi, '0xf851a440'
    ),
    allowance: new Func<[owner: string, spender: string], {owner: string, spender: string}, ethers.BigNumber>(
        abi, '0xdd62ed3e'
    ),
    approve: new Func<[spender: string, amount: ethers.BigNumber], {spender: string, amount: ethers.BigNumber}, boolean>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, ethers.BigNumber>(
        abi, '0x70a08231'
    ),
    balanceOfUnderlying: new Func<[owner: string], {owner: string}, ethers.BigNumber>(
        abi, '0x3af9e669'
    ),
    borrow: new Func<[borrowAmount: ethers.BigNumber], {borrowAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0xc5ebeaec'
    ),
    borrowBalanceCurrent: new Func<[account: string], {account: string}, ethers.BigNumber>(
        abi, '0x17bfdfbc'
    ),
    borrowBalanceStored: new Func<[account: string], {account: string}, ethers.BigNumber>(
        abi, '0x95dd9193'
    ),
    borrowIndex: new Func<[], {}, ethers.BigNumber>(
        abi, '0xaa5af0fd'
    ),
    borrowRatePerTimestamp: new Func<[], {}, ethers.BigNumber>(
        abi, '0xcd91801c'
    ),
    comptroller: new Func<[], {}, string>(
        abi, '0x5fe3b567'
    ),
    decimals: new Func<[], {}, number>(
        abi, '0x313ce567'
    ),
    delegateToImplementation: new Func<[data: string], {data: string}, string>(
        abi, '0x0933c1ed'
    ),
    delegateToViewImplementation: new Func<[data: string], {data: string}, string>(
        abi, '0x4487152f'
    ),
    exchangeRateCurrent: new Func<[], {}, ethers.BigNumber>(
        abi, '0xbd6d894d'
    ),
    exchangeRateStored: new Func<[], {}, ethers.BigNumber>(
        abi, '0x182df0f5'
    ),
    getAccountSnapshot: new Func<[account: string], {account: string}, [_: ethers.BigNumber, _: ethers.BigNumber, _: ethers.BigNumber, _: ethers.BigNumber]>(
        abi, '0xc37f68e2'
    ),
    getCash: new Func<[], {}, ethers.BigNumber>(
        abi, '0x3b1d21a2'
    ),
    implementation: new Func<[], {}, string>(
        abi, '0x5c60da1b'
    ),
    interestRateModel: new Func<[], {}, string>(
        abi, '0xf3fdb15a'
    ),
    isMToken: new Func<[], {}, boolean>(
        abi, '0x699cd5e2'
    ),
    liquidateBorrow: new Func<[borrower: string, repayAmount: ethers.BigNumber, mTokenCollateral: string], {borrower: string, repayAmount: ethers.BigNumber, mTokenCollateral: string}, ethers.BigNumber>(
        abi, '0xf5e3c462'
    ),
    mint: new Func<[mintAmount: ethers.BigNumber], {mintAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0xa0712d68'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    pendingAdmin: new Func<[], {}, string>(
        abi, '0x26782247'
    ),
    protocolSeizeShareMantissa: new Func<[], {}, ethers.BigNumber>(
        abi, '0x6752e702'
    ),
    redeem: new Func<[redeemTokens: ethers.BigNumber], {redeemTokens: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0xdb006a75'
    ),
    redeemUnderlying: new Func<[redeemAmount: ethers.BigNumber], {redeemAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x852a12e3'
    ),
    repayBorrow: new Func<[repayAmount: ethers.BigNumber], {repayAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x0e752702'
    ),
    repayBorrowBehalf: new Func<[borrower: string, repayAmount: ethers.BigNumber], {borrower: string, repayAmount: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x2608f818'
    ),
    reserveFactorMantissa: new Func<[], {}, ethers.BigNumber>(
        abi, '0x173b9904'
    ),
    seize: new Func<[liquidator: string, borrower: string, seizeTokens: ethers.BigNumber], {liquidator: string, borrower: string, seizeTokens: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0xb2a02ff1'
    ),
    supplyRatePerTimestamp: new Func<[], {}, ethers.BigNumber>(
        abi, '0xd3bd2c72'
    ),
    sweepToken: new Func<[token: string], {token: string}, []>(
        abi, '0x1be19560'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    totalBorrows: new Func<[], {}, ethers.BigNumber>(
        abi, '0x47bd3718'
    ),
    totalBorrowsCurrent: new Func<[], {}, ethers.BigNumber>(
        abi, '0x73acee98'
    ),
    totalReserves: new Func<[], {}, ethers.BigNumber>(
        abi, '0x8f840ddd'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
    transfer: new Func<[dst: string, amount: ethers.BigNumber], {dst: string, amount: ethers.BigNumber}, boolean>(
        abi, '0xa9059cbb'
    ),
    transferFrom: new Func<[src: string, dst: string, amount: ethers.BigNumber], {src: string, dst: string, amount: ethers.BigNumber}, boolean>(
        abi, '0x23b872dd'
    ),
    underlying: new Func<[], {}, string>(
        abi, '0x6f307dc3'
    ),
}

export class Contract extends ContractBase {

    accrualBlockTimestamp(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.accrualBlockTimestamp, [])
    }

    admin(): Promise<string> {
        return this.eth_call(functions.admin, [])
    }

    allowance(owner: string, spender: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.allowance, [owner, spender])
    }

    balanceOf(owner: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    borrowBalanceStored(account: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.borrowBalanceStored, [account])
    }

    borrowIndex(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.borrowIndex, [])
    }

    borrowRatePerTimestamp(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.borrowRatePerTimestamp, [])
    }

    comptroller(): Promise<string> {
        return this.eth_call(functions.comptroller, [])
    }

    decimals(): Promise<number> {
        return this.eth_call(functions.decimals, [])
    }

    delegateToViewImplementation(data: string): Promise<string> {
        return this.eth_call(functions.delegateToViewImplementation, [data])
    }

    exchangeRateStored(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.exchangeRateStored, [])
    }

    getAccountSnapshot(account: string): Promise<[_: ethers.BigNumber, _: ethers.BigNumber, _: ethers.BigNumber, _: ethers.BigNumber]> {
        return this.eth_call(functions.getAccountSnapshot, [account])
    }

    getCash(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getCash, [])
    }

    implementation(): Promise<string> {
        return this.eth_call(functions.implementation, [])
    }

    interestRateModel(): Promise<string> {
        return this.eth_call(functions.interestRateModel, [])
    }

    isMToken(): Promise<boolean> {
        return this.eth_call(functions.isMToken, [])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    pendingAdmin(): Promise<string> {
        return this.eth_call(functions.pendingAdmin, [])
    }

    protocolSeizeShareMantissa(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.protocolSeizeShareMantissa, [])
    }

    reserveFactorMantissa(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.reserveFactorMantissa, [])
    }

    supplyRatePerTimestamp(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.supplyRatePerTimestamp, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    totalBorrows(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalBorrows, [])
    }

    totalReserves(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalReserves, [])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }

    underlying(): Promise<string> {
        return this.eth_call(functions.underlying, [])
    }
}
