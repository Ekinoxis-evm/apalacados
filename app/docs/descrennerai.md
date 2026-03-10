Get the pools of a given token address (rate-limit 300 requests per minute)
get

https://api.dexscreener.com
/token-pairs/v1/
{chainId}
/
{tokenAddress}


Get the pools of a given token address (rate-limit 300 requests per minute)
get

https://api.dexscreener.com
/token-pairs/v1/
{chainId}
/
{tokenAddress}
Path parameters
chainId
string
Example: solana
tokenAddress
string
A token addresses

Example: JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN
Responses
200
Ok

application/json
chainId
string
dexId
string
url
string · uri
pairAddress
string
labels
string[] · nullable

baseToken
object

quoteToken
object
priceNative
string
priceUsd
string · nullable

txns
object

volume
object

priceChange
object · nullable

liquidity
object · nullable
fdv
number · nullable
marketCap
number · nullable
pairCreatedAt
integer · nullable

info
object

boosts
object
get
/token-pairs/v1/{chainId}/{tokenAddress}

HTTP

HTTP

Copy
GET /token-pairs/v1/{chainId}/{tokenAddress} HTTP/1.1
Host: api.dexscreener.com
Accept: */*
Test it
200
Ok


Copy
[
  {
    "chainId": "text",
    "dexId": "text",
    "url": "https://example.com",
    "pairAddress": "text",
    "labels": [
      "text"
    ],
    "baseToken": {
      "address": "text",
      "name": "text",
      "symbol": "text"
    },
    "quoteToken": {
      "address": "text",
      "name": "text",
      "symbol": "text"
    },
    "priceNative": "text",
    "priceUsd": "text",
    "txns": {
      "ANY_ADDITIONAL_PROPERTY": {
        "buys": 1,
        "sells": 1
      }
    },
    "volume": {
      "ANY_ADDITIONAL_PROPERTY": 1
    },
    "priceChange": {
      "ANY_ADDITIONAL_PROPERTY": 1
    },
    "liquidity": {
      "usd": 1,
      "base": 1,
      "quote": 1
    },
    "fdv": 1,
    "marketCap": 1,
    "pairCreatedAt": 1,
    "info": {
      "imageUrl": "https://example.com",
      "websites": [
        {
          "url": "https://example.com"
        }
      ],
      "socials": [
        {
          "platform": "text",
          "handle": "text"
        }
      ]
    },
    "boosts": {
      "active": 1
    }
  }
]
Get one or multiple pairs by token address (rate-limit 300 requests per minute)
get

https://api.dexscreener.com
/tokens/v1/
{chainId}
/
{tokenAddresses}
Path parameters
chainId
string
Example: solana
tokenAddresses
string
One or multiple, comma-separated token addresses (up to 30 addresses)

Example: So11111111111111111111111111111111111111112,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Responses
200
Ok

application/json
chainId
string
dexId
string
url
string · uri
pairAddress
string
labels
string[] · nullable

baseToken
object

quoteToken
object
priceNative
string
priceUsd
string · nullable

txns
object

volume
object

priceChange
object · nullable

liquidity
object · nullable
fdv
number · nullable
marketCap
number · nullable
pairCreatedAt
integer · nullable

info
object

boosts
object
