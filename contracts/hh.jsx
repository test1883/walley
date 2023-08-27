const unixToDate = (time) => {
  console.log(time);
  const d = new Date(time * 1000);
  return d.toLocaleString();
};

const nftAddress = "0x8000d0daa796df46db6a8d191ad7d56af41ae421";
const NFTManagerABI = JSON.parse(
  fetch("https://raw.githubusercontent.com/test1883/files/main/NFTManager.json")
    .body
);
const walleyAddress = "0x150ab38996cc9694530f452caca99ad3a1387f5f";
const WalleyABI = JSON.parse(
  fetch("https://raw.githubusercontent.com/test1883/files/main/Walley.json")
    .body
);
State.init({
  general: {
    chainId: undefined,
    balance: 0,
  },
  store: {
    stores: [],
    storeName: "",
    storeAddress: "",
    isStore: false,
    storePendingTransactions: [],
    storePastTransactions: [],
    storeImages: {},
    viewTxn: [],
    approvePassword: "",
    bill: { uploading: false, cid: null },
    totalAmount: 0,
  },
  user: {
    userPendingTransactions: [],
    userPastTransactions: [],
    openModal: 0,
    transferTo: "",
    viewTxn: [],
    transactionPassword: "",
    openReceipt: 0,
  },
  homeInputs: {
    storeName: "",
    amount: 0,
    name: "",
    password: "",
  },
  storeInputs: {
    storeName: "",
    storeAddress: "",
    image: null,
  },
  search: {
    store: "",
    user: "",
  },
  storeName: "",
  view: "home",
  loading: true,
  loadingMsg: "Fetching Data",
  newTxn: false,
  addSt: false,
});

const Styles = props.Styles;
console.log(props);
const sender = Ethers.send("eth_requestAccounts", [])[0];
const updateBalance = (balance) => {
  State.update({ balance });
};
if (!sender) {
  return (
    <Styles.Root>
      <Styles.WalleyIndexContainer>
        <Styles.WalleyTitle>Walley.</Styles.WalleyTitle>
        <Styles.WalleyIndexBody>
          <Styles.WalleyIndexDesc>
            Go Phoneless With the Highly Secured NFT-based Wallet.
          </Styles.WalleyIndexDesc>
          <Styles.WalleyIndexMain>
            <span>Get Started -</span>
            <Web3Connect connectLabel="Connect Wallet" />
          </Styles.WalleyIndexMain>
        </Styles.WalleyIndexBody>
      </Styles.WalleyIndexContainer>
    </Styles.Root>
  );
}
if (state.chainId === undefined && ethers !== undefined && sender) {
  Ethers.provider()
    .getNetwork()
    .then((chainIdData) => {
      if (chainIdData?.chainId) {
        State.update({ chainId: chainIdData.chainId });
      }
    });
  Ethers.provider()
    .getBalance(sender)
    .then((balance) => {
      updateBalance(Big(balance).div(Big(10).pow(18)).toFixed(5));
    });
}
if (state.chainId !== undefined && state.chainId !== 11155111) {
  return <p>Switch to Ethereum Sepolia</p>;
}
const nftIface = new ethers.utils.Interface(NFTManagerABI);
const nftContract = new ethers.Contract(
  nftAddress,
  NFTManagerABI,
  Ethers.provider().getSigner()
);
const walleyIface = new ethers.utils.Interface(WalleyABI);
const walleyContract = new ethers.Contract(
  walleyAddress,
  WalleyABI,
  Ethers.provider().getSigner()
);
//get stores data
if (state.store.stores.length === 0 && nftContract && sender && state.loading) {
  State.update({ loadingMsg: "Fetching Stores" });
  nftContract.getAllStores().then((stores) => {
    onTxInit();
    if (stores.length === 0) {
      State.update({ loading: false, loadingMsg: "" });
    } else {
      const storeState = state.store;
      storeState.stores = stores;
      let store;
      for (let i = 0; i < stores.length; i++) {
        store = stores[i];
        storeState.storeImages[store[0]] = store[2];
        console.log(store[1]);
        console.log(sender);
        if (store[1].toLowerCase() === sender.toLowerCase()) {
          storeState.isStore = true;
          storeState.storeName = store[0];
          storeState.storeAddress = store[1];
          State.update({
            loading: true,
            loadingMsg: "Fetching Store Transactions",
          });
          nftContract.getStoreTransactions(store[1]).then((transactions) => {
            storeState.storePendingTransactions = [];
            storeState.storePastTransactions = [];
            transactions.map((txn) => {
              if (txn[8] === false) {
                storeState.storePendingTransactions.push(txn);
              } else {
                storeState.storePastTransactions.push(txn);
              }
            });
          });
        }
        if (i === stores.length - 1)
          State.update({ store: storeState, loading: false, loadingMsg: "" });
      }
      console.log(state.store);
    }
  });
}

const onTxInit = () => {
  State.update({
    view: "home",
    loading: true,
    loadingMsg: "Fetching transactions",
  });
  nftContract.getMyTransactions({ from: sender }).then((transactions) => {
    const st = [];
    transactions.map((txn) => {
      if (txn[8] === false) st.push(txn);
    });
    State.update({
      user: { ...state.user, userPendingTransactions: st },
      loading: false,
      loadingMsg: "",
    });
  });
};

const onTxPastClick = () => {
  State.update({
    view: "txPast",
    loading: true,
    loadingMsg: "Fetching past transactions",
  });
  nftContract.getMyTransactions({ from: sender }).then((transactions) => {
    const st = [];
    transactions.map((txn) => {
      if (txn[8] === true) st.push(txn);
    });
    State.update({
      user: { ...state.user, userPastTransactions: st },
      loading: false,
      loadingMsg: "",
    });
  });
};

const widgetOptions = () => {
  const options = [];
  for (let i = 0; i < state.store.stores.length; i++)
    options.push({
      text: state.store.stores[i][0],
      value: state.store.stores[i][0],
    });
  console.log(options);
  return options;
};

const homeInputUpdates = (value, field) => {
  const homeInputs = state.homeInputs;
  homeInputs[field] = value;
  State.update({ homeInputs });
};
const storeInputUpdates = (value, field) => {
  const storeInputs = state.storeInputs;
  console.log(storeInputs);
  storeInputs[field] = value;
  console.log(storeInputs);
  State.update({ storeInputs });
};

const addStore = () => {
  State.update({
    loading: true,
    loadingMsg: "Creating a new store",
    addSt: false,
  });
  const { storeName, storeAddress, image } = state.storeInputs;
  nftContract.addStore(storeName, storeAddress, image.cid).then((t) => {
    console.log(t);
    t.wait().then((r) => {
      State.update({
        store: {
          ...state.store,
          stores: [
            ...state.store.stores,
            [storeName, storeAddress.toLowerCase(), image.cid],
          ],
          storeImages: { ...state.store.storeImages, [storeName]: image.cid },
        },
        storeInputs: {
          storeName: "",
          storeAddress: "",
          image: "",
        },
        loading: false,
        loadingMsg: "",
      });
      if (storeAddress.toLowerCase() === sender) {
        // alert(
        //   "Warning - If you have any pending transactions, you won't be able to see them. But they can be completed at the store!"
        // );
        State.update({
          store: { ...state.store, isStore: true, storeAddress, storeName },
        });
      }
    });
  });
};

const getStoreAddress = (storeName) => {
  const t = [];
  state.store.stores.map((store) => {
    if (store[0] === storeName) t.push(store[1]);
  });
  return t[0];
};

const initTransaction = () => {
  State.update({
    newTxn: false,
    loading: true,
    loadingMsg: "Minting your NFT - Please Pay the gas price",
  });
  const { storeName, amount, name, password } = state.homeInputs;
  walleyContract
    .mint(password, { from: sender })
    .then((tx) => {
      State.update({ loadingMsg: "Waiting for confirmation" });
      tx.wait().then((r) => {
        const tokenId = parseInt(r.logs[2].data, 16);
        State.update({
          loadingMsg:
            "Creating your transaction - Please pay the amount you entered + gas",
        });
        nftContract
          .initTransaction(
            walleyAddress,
            name,
            tokenId,
            `${amount * Math.pow(10, 18)}`,
            getStoreAddress(storeName),
            storeName,
            {
              from: sender,
              value: ethers.utils.parseUnits(`${amount}`, 18),
            }
          )
          .then((txInit) => {
            console.log(txInit);
            State.update({
              loadingMsg: "Waiting for the final confirmation",
            });
            txInit.wait().then((res) => {
              console.log(res);
              State.update({
                loading: false,
                loadingMsg: "",
                userInput: {
                  storeName: "",
                  name: "",
                  amount: "",
                  password: "",
                },
              });
            });
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};

const cancelTransaction = (tokenId) => {
  checkPassword(tokenId, state.user.transactionPassword, () => {
    State.update({
      user: { ...state.user, viewTxn: [] },
      loading: true,
      loadingMsg: "Cancelling your transaction - Pay for the gas",
    });
    nftContract
      .cancelTransaction(walleyAddress, tokenId, { from: sender })
      .then((tx) => {
        State.update({ loadingMsg: "Refunding your amount" });
        tx.wait().then((r) => {
          const tmp = [];
          state.user.userPendingTransactions.map((trans) => {
            if (parseInt(trans[1], 16) !== tokenId) {
              tmp.push(trans);
            }
          });
          State.update({
            loading: false,
            loadingMsg: "",
            user: {
              ...state.user,
              userPendingTransactions: tmp,
              transactionPassword: "",
              viewTxn: [],
            },
          });
        });
      });
  });
};

const approveTransaction = (tokenId) => {
  checkPassword(tokenId, state.store.approvePassword, () => {
    State.update({
      user: { ...state.user, viewTxn: [] },
      loading: true,
      loadingMsg: "Approving your transaction - Pay for the gas",
    });
    nftContract
      .approveTransaction(
        walleyAddress,
        tokenId,
        `${state.store.totalAmount * Math.pow(10, 18)}`,
        state.store.bill.cid,
        {
          from: sender,
        }
      )
      .then((tx) => {
        State.update({
          loadingMsg: "Waiting for confirmation - Refunding the change",
        });
        tx.wait().then((res) => {
          const tmp = [];
          const tmpAct = [];
          state.store.storePendingTransactions.map((trans) => {
            if (parseInt(trans[1], 16) !== tokenId) {
              tmp.push(trans);
            } else {
              tmpAct.push(trans);
              tmpAct[0][7] = state.store.bill.cid;
              tmpAct[0][8] = true;
              tmpAct[0][9] = state.store.totalAmount;
            }
          });
          State.update({
            store: {
              ...state.store,
              storePendingTransactions: tmp,
              storePastTransactions: [
                ...state.store.storePastTransactions,
                tmpAct,
              ],
              approvePassword: "",
              bill: { uploading: false, amount: null },
              totalAmount: 0,
            },
            user: { ...state.user, viewTxn: [] },
            loadingMsg: "",
            loading: false,
          });
        });
      });
  });
};

const transferToken = (tokenId) => {
  checkPassword(tokenId, state.user.transactionPassword, () => {
    State.update({
      user: { ...state.user, viewTxn: [] },
      loading: true,
      loadingMsg: "Transferring your Token - Pay for the gas",
    });
    nftContract
      .transferNFT(walleyAddress, tokenId, state.user.transferTo, {
        from: sender,
      })
      .then((tx) => {
        State.update({
          loadingMsg: "Waiting for confirmation",
        });
        tx.wait().then((res) => {
          State.update({
            user: {
              ...state.user,
              userPendingTransactions:
                state.user.userPendingTransactions.filter(
                  (tx) => parseInt(tx[1], 16) !== tokenId
                ),
              viewTxn: [],
              transferTo: "",
            },
            loading: false,
            loadingMsg: "",
          });
        });
      });
  });
};

const checkPassword = (tokenId, password, fn) => {
  walleyContract
    .checkPassword(tokenId, password)
    .then((check) => {
      if (check) {
        console.log("heheheh");
        fn();
      } else console.log("incorrect password");
    })
    .catch((err) => console.log(err));
};
console.log(state.user.viewTxn[11]);
console.log(state.user.viewTxn[11]);
return (
  <Styles.WalleyHomeContainer>
    <Styles.WalleyHomeHeader>
      <p>Walley.</p>
      <Styles.WalleyBalance>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          fill="none"
        >
          <path
            d="M14.5156 0C17.9644 0 20 1.98459 20 5.3818H15.7689V5.41647C13.8052 5.41647 12.2133 6.96849 12.2133 8.883C12.2133 10.7975 13.8052 12.3495 15.7689 12.3495H20V12.6615C20 16.0154 17.9644 18 14.5156 18H5.48444C2.03556 18 0 16.0154 0 12.6615V5.33847C0 1.98459 2.03556 0 5.48444 0H14.5156ZM19.2533 6.87241C19.6657 6.87241 20 7.19834 20 7.60039V10.131C19.9952 10.5311 19.6637 10.8543 19.2533 10.8589H15.8489C14.8548 10.872 13.9855 10.2084 13.76 9.26432C13.6471 8.67829 13.8056 8.07357 14.1931 7.61222C14.5805 7.15087 15.1573 6.88007 15.7689 6.87241H19.2533ZM16.2489 8.04237H15.92C15.7181 8.04005 15.5236 8.11664 15.38 8.25504C15.2364 8.39344 15.1556 8.58213 15.1556 8.77901C15.1555 9.19205 15.4964 9.52823 15.92 9.53298H16.2489C16.6711 9.53298 17.0133 9.1993 17.0133 8.78767C17.0133 8.37605 16.6711 8.04237 16.2489 8.04237ZM10.3822 3.89119H4.73778C4.31903 3.89116 3.9782 4.2196 3.97333 4.62783C3.97333 5.04087 4.31415 5.37705 4.73778 5.3818H10.3822C10.8044 5.3818 11.1467 5.04812 11.1467 4.6365C11.1467 4.22487 10.8044 3.89119 10.3822 3.89119Z"
            fill="#fff"
          />
        </svg>{" "}
        {state.balance} ETH
      </Styles.WalleyBalance>
    </Styles.WalleyHomeHeader>
    <Styles.WalleyHomeMain>
      {state.loading ? (
        <Styles.WalleyLoading>
          <Styles.WalleyModal>
            <img src="https://svgshare.com/i/wuF.svg" title="" />
            <p>{state.loadingMsg}</p>
          </Styles.WalleyModal>
        </Styles.WalleyLoading>
      ) : (
        ""
      )}

      {state.user.viewTxn.length !== 0 ? (
        <Styles.TransactionModal>
          <Styles.TransactionCard>
            <Styles.WalleyImageContainer>
              <Styles.WalleyStoreImage
                src={`https://ipfs.near.social/ipfs/${
                  state.store.storeImages[state.user.viewTxn[6]]
                }`}
                alt={state.user.viewTxn[6]}
              />
            </Styles.WalleyImageContainer>
            <Styles.TransactionCardMain>
              <p>Name - {state.user.viewTxn[2]}</p>
              <p>Store name - {state.user.viewTxn[6]} </p>
              <p>Amount - {Big(state.user.viewTxn[5]).toFixed(5)}</p>
              <p>Time - {unixToDate(parseInt(state.user.viewTxn[10], 16))}</p>
              {state.user.viewTxn[11] === "cancel" ? (
                <>
                  <Styles.WalleyLabel>
                    Enter the transaction password
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    type="password"
                    value={state.user.transactionPassword}
                    onChange={(e) =>
                      State.update({
                        user: {
                          ...state.user,
                          transactionPassword: e.target.value,
                        },
                      })
                    }
                  />
                  <Styles.WalleyButton
                    color="white"
                    bg="blue"
                    onClick={() =>
                      State.update({
                        user: {
                          ...state.user,
                          viewTxn: [],
                          transactionPassword: "",
                        },
                      })
                    }
                  >
                    Close
                  </Styles.WalleyButton>
                  <Styles.WalleyButton
                    color="white"
                    bg="red"
                    onClick={() =>
                      cancelTransaction(parseInt(state.user.viewTxn[1], 16))
                    }
                  >
                    Cancel
                  </Styles.WalleyButton>
                </>
              ) : state.user.viewTxn[11] === "transfer" ? (
                <>
                  <Styles.WalleyLabel>
                    Enter the transaction password
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    type="password"
                    placeholder="Enter the transaction password"
                    value={state.user.transactionPassword}
                    onChange={(e) =>
                      State.update({
                        user: {
                          ...state.user,
                          transactionPassword: e.target.value,
                        },
                      })
                    }
                  />
                  <Styles.WalleyLabel>
                    Enter the Receiver's Address
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    type="text"
                    value={state.user.transferTo}
                    placeholder="Receiver's Address"
                    onChange={(e) =>
                      State.update({
                        user: {
                          ...state.user,
                          transferTo: e.target.value,
                        },
                      })
                    }
                  />
                  <Styles.WalleyButton
                    color="white"
                    bg="blue"
                    onClick={() =>
                      State.update({
                        user: {
                          ...state.user,
                          viewTxn: [],
                          transactionPassword: "",
                        },
                      })
                    }
                  >
                    Close
                  </Styles.WalleyButton>
                  <Styles.WalleyButton
                    color="white"
                    bg="red"
                    onClick={() =>
                      transferToken(parseInt(state.user.viewTxn[1], 16))
                    }
                  >
                    Transfer
                  </Styles.WalleyButton>
                </>
              ) : state.user.viewTxn[11] === "approve" ? (
                <>
                  <Styles.WalleyLabel>
                    Please upload the bill -{" "}
                  </Styles.WalleyLabel>
                  <IpfsImageUpload image={state.store.bill} />
                  <Styles.WalleyLabel>Total Bill Amount</Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.store.totalAmount}
                    onChange={(e) =>
                      State.update({
                        store: {
                          ...state.store,
                          totalAmount: e.target.value,
                        },
                      })
                    }
                  />
                  <Styles.WalleyLabel>Transaction Password</Styles.WalleyLabel>
                  <Styles.WalleyInput
                    type="password"
                    value={state.store.approvePassword}
                    onChange={(e) =>
                      State.update({
                        store: {
                          ...state.store,
                          approvePassword: e.target.value,
                        },
                      })
                    }
                  />
                  <Styles.WalleyButton
                    color="white"
                    bg="blue"
                    onClick={() => {
                      State.update({
                        store: {
                          ...state.store,
                          approvePassword: "",
                          bill: { uploading: false, cid: "" },
                          totalAmount: null,
                        },
                        user: { ...state.user, viewTxn: [] },
                      });
                    }}
                  >
                    Close
                  </Styles.WalleyButton>
                  <Styles.WalleyButton
                    color="white"
                    bg="blue"
                    onClick={() => {
                      console.log(state.store.bill.cid);
                      if (state.store.bill.cid) {
                        approveTransaction(parseInt(state.user.viewTxn[1], 16));
                      } else {
                        console.log("Please Upload the bill");
                      }
                    }}
                  >
                    Approve
                  </Styles.WalleyButton>
                </>
              ) : (
                ""
              )}
            </Styles.TransactionCardMain>
          </Styles.TransactionCard>
        </Styles.TransactionModal>
      ) : (
        ""
      )}
      {!state.store.isStore ? (
        <>
          <Styles.WalleyNavbar>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="menu"
            >
              <g data-name="Layer 2">
                <g data-name="menu-2">
                  <rect
                    width="24"
                    height="24"
                    opacity="0"
                    transform="rotate(180 12 12)"
                  ></rect>
                  <circle cx="0" cy="12" r="1"></circle>
                  <rect
                    width="14"
                    height="2"
                    x="3"
                    y="11"
                    rx=".94"
                    ry=".94"
                  ></rect>
                  <rect
                    width="18"
                    height="2"
                    x="0"
                    y="16"
                    rx=".94"
                    ry=".94"
                  ></rect>
                  <rect
                    width="18"
                    height="2"
                    x="0"
                    y="6"
                    rx=".94"
                    ry=".94"
                  ></rect>
                </g>
              </g>
            </svg>
            <Styles.NavLine></Styles.NavLine>
            <Styles.WalleyNavbarButton
              onClick={() => State.update({ view: "home" })}
            >
              <span>Home</span>
            </Styles.WalleyNavbarButton>
            <Styles.NavLine></Styles.NavLine>
            <Styles.WalleyNavbarButton onClick={onTxPastClick}>
              <span>Receipts</span>
            </Styles.WalleyNavbarButton>
            <Styles.NavLine></Styles.NavLine>
            <Styles.WalleyNavbarButton
              onClick={() => State.update({ addSt: true })}
            >
              <span>Add a store</span>
            </Styles.WalleyNavbarButton>
            <Styles.NavLineLast></Styles.NavLineLast>
          </Styles.WalleyNavbar>
          <Styles.WalleyHomeBody>
            {state.newTxn ? (
              <Styles.WalleyHomeOverlay
                id="overlay"
                onClick={(e) => {
                  if ("overlay" === e.target.id) {
                    State.update({ newTxn: false });
                  }
                }}
              >
                <Styles.WalleyHomeForm>
                  <Styles.WalleyLabel>Select a Store</Styles.WalleyLabel>
                  <Widget
                    src="near/widget/Select"
                    props={{
                      value: state.homeInputs.storeName,
                      noLabel: true,
                      placeholder:
                        state.store.stores.length !== 0
                          ? "Select a store"
                          : "No Store Available",
                      options: [...widgetOptions()],
                      onChange: (value) => {
                        homeInputUpdates(value.text, "storeName");
                      },
                    }}
                  />
                  <Styles.WalleyLabel>
                    Enter the maximum amount you'd like to spend(in INR)
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.homeInputs.amount}
                    type="number"
                    onChange={(e) => homeInputUpdates(e.target.value, "amount")}
                    placeholder="Amount(in INR)"
                  />
                  <Styles.WalleyLabel>
                    Name(will be asked at the store)
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.homeInputs.name}
                    type="text"
                    onChange={(e) => homeInputUpdates(e.target.value, "name")}
                    placeholder="Name"
                  />
                  <Styles.WalleyLabel>
                    Set a password for the transaction(will be asked during
                    checkout)
                  </Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.homeInputs.password}
                    type="password"
                    onChange={(e) =>
                      homeInputUpdates(e.target.value, "password")
                    }
                    placeholder="Password"
                  />
                  <Styles.WalleyButton
                    color="#fff"
                    bg="#FFA500"
                    onClick={initTransaction}
                  >
                    Buy The Store NFT
                  </Styles.WalleyButton>
                </Styles.WalleyHomeForm>
              </Styles.WalleyHomeOverlay>
            ) : (
              ""
            )}
            {state.addSt ? (
              <Styles.WalleyStoreOverlay>
                <Styles.WalleyStoreForm>
                  <Styles.WalleyLabel>Store Name</Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.storeInputs.storeName}
                    type="text"
                    onChange={(e) => {
                      storeInputUpdates(e.target.value, "storeName");
                    }}
                    placeholder="Enter the Store Name"
                  />
                  <Styles.WalleyLabel>Store Address</Styles.WalleyLabel>
                  <Styles.WalleyInput
                    value={state.storeInputs.storeAddress}
                    type="text"
                    onChange={(e) =>
                      storeInputUpdates(e.target.value, "storeAddress")
                    }
                    placeholder="Enter the Store Address"
                  />
                  <Styles.WalleyStoreButton
                    onClick={() => storeInputUpdates(sender, "storeAddress")}
                  >
                    Use current address(convert this account into a store)
                  </Styles.WalleyStoreButton>
                  <Styles.WalleyLabel>Add Cover Image</Styles.WalleyLabel>
                  <IpfsImageUpload image={state.storeInputs.image} />
                  <Styles.WalleyButton
                    color="#fff"
                    bg="#FA9703"
                    onClick={addStore}
                  >
                    Add Store
                  </Styles.WalleyButton>
                  <Styles.WalleyButton
                    color="#fff"
                    bg="#FA9703"
                    onClick={() => State.update({ addSt: false })}
                  >
                    Cancel
                  </Styles.WalleyButton>
                </Styles.WalleyStoreForm>
              </Styles.WalleyStoreOverlay>
            ) : (
              ""
            )}
            {state.view === "home" ? (
              <>
                <Styles.WalleySearch>
                  <Styles.WalleyButton
                    bg="#424242"
                    color="white"
                    onClick={() => State.update({ newTxn: true })}
                  >
                    Buy New NFT
                  </Styles.WalleyButton>
                  <Styles.WalleyInput
                    value={state.search.store}
                    onChange={(e) =>
                      State.update({
                        search: { ...state.search, store: e.target.value },
                      })
                    }
                    placeholder="Search Transactions by Store Name"
                  />
                </Styles.WalleySearch>
                <p className="txn">Your Transactions</p>
                <Styles.WalleyTransactions>
                  {state.user.userPendingTransactions.length !== 0
                    ? state.user.userPendingTransactions
                        .filter((tx) =>
                          tx[6]
                            .toLowerCase()
                            .includes(state.search.store.toLowerCase())
                        )
                        .map((tx) => (
                          <Styles.TransactionCard>
                            <Styles.WalleyImageContainer>
                              <Styles.WalleyStoreImage
                                src={`https://ipfs.near.social/ipfs/${
                                  state.store.storeImages[tx[6]]
                                }`}
                                alt={tx[6]}
                              />
                            </Styles.WalleyImageContainer>
                            <Styles.TransactionCardMain>
                              <p>Name - {tx[2]}</p>
                              <p>Store name - {tx[6]} </p>
                              <p>Amount - {Big(tx[5]).toFixed(5)}</p>
                              <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                              <Styles.WalleyButton
                                color="white"
                                bg="red"
                                onClick={() =>
                                  State.update({
                                    user: {
                                      ...state.user,
                                      viewTxn: [...tx, "transfer"],
                                      transactionPassword: "",
                                    },
                                  })
                                }
                              >
                                Transfer
                              </Styles.WalleyButton>
                              <Styles.WalleyButton
                                color="white"
                                bg="red"
                                onClick={() =>
                                  State.update({
                                    user: {
                                      ...state.user,
                                      viewTxn: [...tx, "cancel"],
                                      transactionPassword: "",
                                    },
                                  })
                                }
                              >
                                Cancel
                              </Styles.WalleyButton>
                            </Styles.TransactionCardMain>
                          </Styles.TransactionCard>
                        ))
                    : "No pending transactions found"}
                </Styles.WalleyTransactions>
              </>
            ) : state.view === "txPast" ? (
              <>
                <Styles.WalleySearch>
                  <Styles.WalleyButton
                    bg="#424242"
                    color="white"
                    onClick={() => State.update({ newTxn: true })}
                  >
                    Buy New NFT
                  </Styles.WalleyButton>
                  <Styles.WalleyInput
                    value={state.search.store}
                    onChange={(e) =>
                      State.update({
                        search: { ...state.search, store: e.target.value },
                      })
                    }
                    placeholder="Search Transactions by Store Name"
                  />
                </Styles.WalleySearch>
                <p className="txn">Your Receipts</p>
                <Styles.WalleyTransactions>
                  {state.user.userPastTransactions.length !== 0
                    ? state.user.userPastTransactions
                        .filter((tx) =>
                          tx[6]
                            .toLowerCase()
                            .includes(state.search.store.toLowerCase())
                        )
                        .map((tx) => (
                          <Styles.TransactionCard>
                            <Styles.WalleyImageContainer>
                              <Styles.WalleyStoreImage
                                src={`https://ipfs.near.social/ipfs/${
                                  state.store.storeImages[tx[6]]
                                }`}
                                alt={tx[6]}
                              />
                            </Styles.WalleyImageContainer>
                            <Styles.TransactionCardMain>
                              <p>Name - {tx[2]}</p>
                              <p>Store name - {tx[6]} </p>
                              <p>Max Amount - {Big(tx[5]).toFixed(5)}</p>
                              <p>Total Bill Amount - {Big(tx[9]).toFixed(5)}</p>

                              <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                              {state.user.openReceipt ===
                              Big(tx[1]).toFixed(0) ? (
                                <>
                                  <Styles.WalleyStoreImage
                                    src={`https://ipfs.near.social/ipfs/${tx[7]}`}
                                    alt={tx[7]}
                                  />
                                  <Styles.WalleyButton
                                    color="#fff"
                                    bg="#FA9703"
                                    onClick={() =>
                                      State.update({
                                        user: {
                                          ...state.user,
                                          openReceipt: 0,
                                        },
                                      })
                                    }
                                  >
                                    Close Receipt
                                  </Styles.WalleyButton>
                                </>
                              ) : (
                                <Styles.WalleyButton
                                  color="#fff"
                                  bg="#FA9703"
                                  onClick={() =>
                                    State.update({
                                      user: {
                                        ...state.user,
                                        openReceipt: Big(tx[1]).toFixed(0),
                                      },
                                    })
                                  }
                                >
                                  Show Receipt
                                </Styles.WalleyButton>
                              )}
                            </Styles.TransactionCardMain>
                          </Styles.TransactionCard>
                        ))
                    : "No past transactions found"}
                </Styles.WalleyTransactions>
              </>
            ) : (
              ""
            )}
          </Styles.WalleyHomeBody>
        </>
      ) : (
        <>
          <Styles.WalleyNavbar>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none">
              <path
                d="M42.3795 1.00041H3.49873C-0.658836 0.841665 -0.658836 7.16116 3.49873 7.00242H42.2245C46.3065 7.16116 46.4652 1.00041 42.3833 1.00041H42.3795ZM3.49873 25.0009C-0.500093 25.0009 -0.500093 30.9991 3.49873 30.9991H25.4204C29.5024 30.9991 29.5024 25.0009 25.4204 25.0009H3.49873ZM3.49873 49.0014C-0.500093 49.0014 -0.500093 54.9996 3.49873 54.9996H52.6222C56.621 54.9996 56.621 49.0014 52.6222 49.0014H3.49873Z"
                fill="white"
              />
            </svg>
            <Styles.NavLine></Styles.NavLine>
            <Styles.WalleyNavbarButton
              onClick={() => State.update({ view: "home" })}
            >
              <span>Home</span>
            </Styles.WalleyNavbarButton>
            <Styles.NavLine></Styles.NavLine>
            <Styles.WalleyNavbarButton
              onClick={() => State.update({ view: "txPast" })}
            >
              <span>Receipts</span>
            </Styles.WalleyNavbarButton>
            <Styles.NavLineLast></Styles.NavLineLast>
          </Styles.WalleyNavbar>
          <Styles.WalleyStoreBody>
                <Styles.WalleySearch>
                  <Styles.WalleyInput
                    value={state.search.user}
                    onChange={(e) =>
                      State.update({
                        search: { ...state.search, user: e.target.value },
                      })
                    }
                    placeholder="Search Transactions by User Name"
                  />
                </Styles.WalleySearch>
            <Styles.WalleyTransactions>
              {state.view === "home"
                ? state.store.storePendingTransactions.length !== 0
                  ? state.store.storePendingTransactions.filter(tx => tx[6]
                    .toLowerCase()
                    .includes(state.search.store.toLowerCase())).map((tx) => (
                      <Styles.TransactionCard>
                        <Styles.WalleyImageContainer>
                          <Styles.WalleyStoreImage
                            src={`https://ipfs.near.social/ipfs/${
                              state.store.storeImages[tx[6]]
                            }`}
                            alt={tx[6]}
                          />
                        </Styles.WalleyImageContainer>
                        <Styles.TransactionCardMain>
                          <p>Name - {tx[2]}</p>
                          <p>Store name - {tx[6]} </p>
                          <p>Max amount - {Big(tx[5]).toFixed(5)}</p>

                          <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                          <Styles.WalleyButton
                            color="white"
                            bg="blue"
                            onClick={() =>
                              State.update({
                                store: {
                                  ...state.store,
                                  approvePassword: "",
                                  bill: { uploading: false, amount: null },
                                  totalAmount: null,
                                },
                                user: {
                                  ...state.user,
                                  viewTxn: [...tx, "approve"],
                                },
                              })
                            }
                          >
                            Approve
                          </Styles.WalleyButton>
                        </Styles.TransactionCardMain>
                      </Styles.TransactionCard>
                    ))
                  : "No pending transactions"
                : state.store.storePastTransactions.length !== 0
                ? state.store.storePastTransactions.filter(tx => tx[6]
                  .toLowerCase()
                  .includes(state.search.store.toLowerCase())).map((tx) => (
                    <Styles.TransactionCard>
                      <Styles.WalleyImageContainer>
                        <Styles.WalleyStoreImage
                          src={`https://ipfs.near.social/ipfs/${
                            state.store.storeImages[tx[6]]
                          }`}
                          alt={tx[6]}
                        />
                      </Styles.WalleyImageContainer>
                      <Styles.TransactionCardMain>
                        <p>Name - {tx[2]}</p>
                        <p>Store name - {tx[6]} </p>
                        <p>Max Amount - {Big(tx[5]).toFixed(5)}</p>

                        <p>Total Bill Amount - {Big(tx[9]).toFixed(5)}</p>

                        <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                        {state.user.openReceipt === Big(tx[1]).toFixed(0) ? (
                          <>
                            <Styles.WalleyStoreImage
                              src={`https://ipfs.near.social/ipfs/${tx[7]}`}
                              alt={tx[7]}
                            />
                            <Styles.WalleyButton
                              color="#fff"
                              bg="#FA9703"
                              onClick={() =>
                                State.update({
                                  user: {
                                    ...state.user,
                                    openReceipt: 0,
                                  },
                                })
                              }
                            >
                              Close Receipt
                            </Styles.WalleyButton>
                          </>
                        ) : (
                          <Styles.WalleyButton
                            color="#fff"
                            bg="#FA9703"
                            onClick={() =>
                              State.update({
                                user: {
                                  ...state.user,
                                  openReceipt: Big(tx[1]).toFixed(0),
                                },
                              })
                            }
                          >
                            Show Receipt
                          </Styles.WalleyButton>
                        )}
                      </Styles.TransactionCardMain>
                    </Styles.TransactionCard>
                  ))
                : "No past transactions found"}
            </Styles.WalleyTransactions>
          </Styles.WalleyStoreBody>
        </>
      )}
    </Styles.WalleyHomeMain>
  </Styles.WalleyHomeContainer>
);
