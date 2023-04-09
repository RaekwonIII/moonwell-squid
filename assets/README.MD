# Notes

mGLRM
0x091608f4e4a15335145be0a279483c0f8e4c7955
ABI: `ctoken.json`

https://moonscan.io/address/0xed301cd3eb27217bdb05c4e9b820a8a3c8b665f9#readContract
ABI: `priceOracle.json`

Price Oracle => getFeed(symbol) => feedProxy address 
https://moonscan.io/address/0x4497B606be93e773bbA5eaCFCb2ac5E2214220Eb#readContract
ABI: `feedProxy.json`

feedProxy.aggregator() => *actual* feed address
https://moonscan.io/address/0x62ca6b55f0bb1241c635e3dff51883f8b9f49aa4
Feed emits => AnswerUpdated => **Price changed!!!**. From moonwell subgraph comments:

```javascript
// Update market price when feed contract emits AnswerUpdated
// Compared to updating market price only when users interact with a market
// This ensures more up-to-date price hence more accurate liquidation monitoring
```
Price Oracle => getUnderlyingPrice(address)

Moonwell subgraph
https://api.thegraph.com/subgraphs/name/moonwell-fi/moonwell-moonbeam/graphql

```graphql
query MyQuery {
  comptroller(id: "1") {
    priceOracle
  }
  market(id: "0x091608f4e4a15335145be0a279483c0f8e4c7955") {
    _feed
    id
    name
    cash
    borrowRate
    borrowPaused
    borrowerCount
    reserves
    supplyRate
    symbol
    totalSupply
    underlyingAddress
    underlyingDecimals
    underlyingName
    underlyingPrice
    underlyingPriceUSD
    underlyingSymbol
  }
}
```