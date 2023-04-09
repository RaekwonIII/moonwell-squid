export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "_nativeToken"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FeedSet",
        "inputs": [
            {
                "type": "address",
                "name": "feed",
                "indexed": false
            },
            {
                "type": "string",
                "name": "symbol",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewAdmin",
        "inputs": [
            {
                "type": "address",
                "name": "oldAdmin",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newAdmin",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "PricePosted",
        "inputs": [
            {
                "type": "address",
                "name": "asset",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "previousPriceMantissa",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "requestedPriceMantissa",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newPriceMantissa",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "admin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "assetPrices",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "getFeed",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "symbol"
            }
        ],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "getUnderlyingPrice",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "mToken"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "isPriceOracle",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "nativeToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "setAdmin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newAdmin"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDirectPrice",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "asset"
            },
            {
                "type": "uint256",
                "name": "price"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFeed",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "string",
                "name": "symbol"
            },
            {
                "type": "address",
                "name": "feed"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setUnderlyingPrice",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "mToken"
            },
            {
                "type": "uint256",
                "name": "underlyingPriceMantissa"
            }
        ],
        "outputs": []
    }
]
