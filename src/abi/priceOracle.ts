import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './priceOracle.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    FeedSet: new LogEvent<([feed: string, symbol: string] & {feed: string, symbol: string})>(
        abi, '0xd9e7d1778ca05570ced72c9aeb12a41fcc76f7f57ea25853dea228f8836d0022'
    ),
    NewAdmin: new LogEvent<([oldAdmin: string, newAdmin: string] & {oldAdmin: string, newAdmin: string})>(
        abi, '0xf9ffabca9c8276e99321725bcb43fb076a6c66a54b7f21c4e8146d8519b417dc'
    ),
    PricePosted: new LogEvent<([asset: string, previousPriceMantissa: ethers.BigNumber, requestedPriceMantissa: ethers.BigNumber, newPriceMantissa: ethers.BigNumber] & {asset: string, previousPriceMantissa: ethers.BigNumber, requestedPriceMantissa: ethers.BigNumber, newPriceMantissa: ethers.BigNumber})>(
        abi, '0xdd71a1d19fcba687442a1d5c58578f1e409af71a79d10fd95a4d66efd8fa9ae7'
    ),
}

export const functions = {
    admin: new Func<[], {}, string>(
        abi, '0xf851a440'
    ),
    assetPrices: new Func<[asset: string], {asset: string}, ethers.BigNumber>(
        abi, '0x5e9a523c'
    ),
    getFeed: new Func<[symbol: string], {symbol: string}, string>(
        abi, '0x3b39a51c'
    ),
    getUnderlyingPrice: new Func<[mToken: string], {mToken: string}, ethers.BigNumber>(
        abi, '0xfc57d4df'
    ),
    isPriceOracle: new Func<[], {}, boolean>(
        abi, '0x66331bba'
    ),
    nativeToken: new Func<[], {}, string>(
        abi, '0xe1758bd8'
    ),
    setAdmin: new Func<[newAdmin: string], {newAdmin: string}, []>(
        abi, '0x704b6c02'
    ),
    setDirectPrice: new Func<[asset: string, price: ethers.BigNumber], {asset: string, price: ethers.BigNumber}, []>(
        abi, '0x09a8acb0'
    ),
    setFeed: new Func<[symbol: string, feed: string], {symbol: string, feed: string}, []>(
        abi, '0x0c607acf'
    ),
    setUnderlyingPrice: new Func<[mToken: string, underlyingPriceMantissa: ethers.BigNumber], {mToken: string, underlyingPriceMantissa: ethers.BigNumber}, []>(
        abi, '0x127ffda0'
    ),
}

export class Contract extends ContractBase {

    admin(): Promise<string> {
        return this.eth_call(functions.admin, [])
    }

    assetPrices(asset: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.assetPrices, [asset])
    }

    getFeed(symbol: string): Promise<string> {
        return this.eth_call(functions.getFeed, [symbol])
    }

    getUnderlyingPrice(mToken: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getUnderlyingPrice, [mToken])
    }

    isPriceOracle(): Promise<boolean> {
        return this.eth_call(functions.isPriceOracle, [])
    }

    nativeToken(): Promise<string> {
        return this.eth_call(functions.nativeToken, [])
    }
}
