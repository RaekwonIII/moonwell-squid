export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "underlying_"
            },
            {
                "type": "address",
                "name": "comptroller_"
            },
            {
                "type": "address",
                "name": "interestRateModel_"
            },
            {
                "type": "uint256",
                "name": "initialExchangeRateMantissa_"
            },
            {
                "type": "string",
                "name": "name_"
            },
            {
                "type": "string",
                "name": "symbol_"
            },
            {
                "type": "uint8",
                "name": "decimals_"
            },
            {
                "type": "address",
                "name": "admin_"
            },
            {
                "type": "address",
                "name": "implementation_"
            },
            {
                "type": "bytes",
                "name": "becomeImplementationData"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AccrueInterest",
        "inputs": [
            {
                "type": "uint256",
                "name": "cashPrior",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "interestAccumulated",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "borrowIndex",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "totalBorrows",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Approval",
        "inputs": [
            {
                "type": "address",
                "name": "owner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "spender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Borrow",
        "inputs": [
            {
                "type": "address",
                "name": "borrower",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "borrowAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "accountBorrows",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "totalBorrows",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Failure",
        "inputs": [
            {
                "type": "uint256",
                "name": "error",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "info",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "detail",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "LiquidateBorrow",
        "inputs": [
            {
                "type": "address",
                "name": "liquidator",
                "indexed": false
            },
            {
                "type": "address",
                "name": "borrower",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "repayAmount",
                "indexed": false
            },
            {
                "type": "address",
                "name": "mTokenCollateral",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "seizeTokens",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Mint",
        "inputs": [
            {
                "type": "address",
                "name": "minter",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "mintAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "mintTokens",
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
        "name": "NewComptroller",
        "inputs": [
            {
                "type": "address",
                "name": "oldComptroller",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newComptroller",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewImplementation",
        "inputs": [
            {
                "type": "address",
                "name": "oldImplementation",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newImplementation",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewMarketInterestRateModel",
        "inputs": [
            {
                "type": "address",
                "name": "oldInterestRateModel",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newInterestRateModel",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewPendingAdmin",
        "inputs": [
            {
                "type": "address",
                "name": "oldPendingAdmin",
                "indexed": false
            },
            {
                "type": "address",
                "name": "newPendingAdmin",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewProtocolSeizeShare",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldProtocolSeizeShareMantissa",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newProtocolSeizeShareMantissa",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewReserveFactor",
        "inputs": [
            {
                "type": "uint256",
                "name": "oldReserveFactorMantissa",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newReserveFactorMantissa",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Redeem",
        "inputs": [
            {
                "type": "address",
                "name": "redeemer",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "redeemAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "redeemTokens",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RepayBorrow",
        "inputs": [
            {
                "type": "address",
                "name": "payer",
                "indexed": false
            },
            {
                "type": "address",
                "name": "borrower",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "repayAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "accountBorrows",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "totalBorrows",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ReservesAdded",
        "inputs": [
            {
                "type": "address",
                "name": "benefactor",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "addAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newTotalReserves",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "ReservesReduced",
        "inputs": [
            {
                "type": "address",
                "name": "admin",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "reduceAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newTotalReserves",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Transfer",
        "inputs": [
            {
                "type": "address",
                "name": "from",
                "indexed": true
            },
            {
                "type": "address",
                "name": "to",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "_acceptAdmin",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "_addReserves",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "addAmount"
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
        "name": "_reduceReserves",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "reduceAmount"
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
        "name": "_setComptroller",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newComptroller"
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
        "name": "_setImplementation",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "implementation_"
            },
            {
                "type": "bool",
                "name": "allowResign"
            },
            {
                "type": "bytes",
                "name": "becomeImplementationData"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "_setInterestRateModel",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newInterestRateModel"
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
        "name": "_setPendingAdmin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newPendingAdmin"
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
        "name": "_setProtocolSeizeShare",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newProtocolSeizeShareMantissa"
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
        "name": "_setReserveFactor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "newReserveFactorMantissa"
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
        "name": "accrualBlockTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "accrueInterest",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
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
        "name": "allowance",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
            },
            {
                "type": "address",
                "name": "spender"
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
        "name": "approve",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "spender"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "balanceOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
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
        "name": "balanceOfUnderlying",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "owner"
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
        "name": "borrow",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "borrowAmount"
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
        "name": "borrowBalanceCurrent",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
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
        "name": "borrowBalanceStored",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
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
        "name": "borrowIndex",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "borrowRatePerTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "comptroller",
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
        "name": "decimals",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint8"
            }
        ]
    },
    {
        "type": "function",
        "name": "delegateToImplementation",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "bytes"
            }
        ]
    },
    {
        "type": "function",
        "name": "delegateToViewImplementation",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes",
                "name": "data"
            }
        ],
        "outputs": [
            {
                "type": "bytes"
            }
        ]
    },
    {
        "type": "function",
        "name": "exchangeRateCurrent",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "exchangeRateStored",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "getAccountSnapshot",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            },
            {
                "type": "uint256"
            },
            {
                "type": "uint256"
            },
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCash",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "implementation",
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
        "name": "interestRateModel",
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
        "name": "isMToken",
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
        "name": "liquidateBorrow",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "borrower"
            },
            {
                "type": "uint256",
                "name": "repayAmount"
            },
            {
                "type": "address",
                "name": "mTokenCollateral"
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
        "name": "mint",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "mintAmount"
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
        "name": "name",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string"
            }
        ]
    },
    {
        "type": "function",
        "name": "pendingAdmin",
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
        "name": "protocolSeizeShareMantissa",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "redeem",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "redeemTokens"
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
        "name": "redeemUnderlying",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "redeemAmount"
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
        "name": "repayBorrow",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "repayAmount"
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
        "name": "repayBorrowBehalf",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "borrower"
            },
            {
                "type": "uint256",
                "name": "repayAmount"
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
        "name": "reserveFactorMantissa",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "seize",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "liquidator"
            },
            {
                "type": "address",
                "name": "borrower"
            },
            {
                "type": "uint256",
                "name": "seizeTokens"
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
        "name": "supplyRatePerTimestamp",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "sweepToken",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "token"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "symbol",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "string"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalBorrows",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalBorrowsCurrent",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalReserves",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalSupply",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "transfer",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "dst"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "transferFrom",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "src"
            },
            {
                "type": "address",
                "name": "dst"
            },
            {
                "type": "uint256",
                "name": "amount"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "underlying",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    }
]
