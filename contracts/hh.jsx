const unixToDate = (time) => {
    const d = new Date(time * 1000);
    return d.toLocaleString();
  };
  
  const nftAddress = "0x2e0f4a4123d0072f46bf67127270a80114541d86";
  const NFTManagerABI = JSON.parse(
    fetch("https://raw.githubusercontent.com/test1883/files/main/NFTManager.json")
      .body
  );
  const walleyAddress = "0x8ae53c3a6bf7762db9cc7603a290d769020e4e77";
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
      viewTxn: null,
      approvePassword: "",
      bill: { uploading: false, cid: null },
      totalAmount: 0,
    },
    user: {
      userPendingTransactions: [],
      userPastTransactions: [],
      openModal: 0,
      transferTo: "",
      viewTxn: null,
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
      image: "",
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
  
  const cssFont = fetch(
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
  ).body;
  
  const Root = styled.div`
    
      background: url("https://img.freepik.com/free-vector/abstract-black-shapes-background-design_1017-31904.jpg?w=826&t=st=1692784084~exp=1692784684~hmac=640a88623947cac46d90337f2d03281af01efcdcd5aa64901719774754bd75b3");
      background-size: cover;
      display: flex;
      font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      ${cssFont}
      flex-direction: column;
      padding: 0;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      height: 100vh;
      width: 100vw;
      @media screen and (max-width: 600px) {
        background-position: 70% 70%;
      }
  `;
  
  const WalleyTitle = styled.div`
      text-align: left;
      font-weight: 900;
      width: 100%;
      font-size: 30px;
      margin: 0px;
      padding: 5px;
      color: #fff; 
      @media screen and (max-width: 600px) {
        text-align: center;
      }
  `;
  
  const WalleyIndexContainer = styled.div`
      height: 100vh;
      color: #fff;
      width: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
  `;
  
  const WalleyIndexBody = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    width: 500px;
    padding-left: 50px;
    @media screen and (max-width:600px) {
      width: 100%;
      padding-left: 0;
      align-items: center;
    }
  `;
  
  const WalleyIndexDesc = styled.div`
      color: #fff;
      font-weight: 500;
      font-size: 50px;
      padding-bottom: 10px;
      margin-top: 50px;
      @media screen and (max-width: 400px) {
        margin-top: 150px;
        font-size: 40px;
      }
  `;
  
  const WalleyIndexMain = styled.div`
      margin-top: 20px;
      width: 100%;
      padding: 20px;
      @media screen and (max-width: 600px) {
        text-align: center;
        position: fixed;
        bottom: 0px;
        left: 0px;
      }
      &>span {
        font-weight: 500;
        @media screen and (max-width: 600px) {
          display: none;
          width: 0px;
        }
      }
      &>button {
          border: none;
          background: #FA9703;
          color: white;
          border-radius: 20px;
          margin-left: 20px;
          transition: all .2s ease-out;
          &:hover {
            scale: 1.05;
            background:#FA9703;
          }
          &:focused {
            background:#FA9703;
          }
          @media screen and (max-width: 600px) {
            width: 100%;
            height: 50px;
            font-size: 15px;
            display: block;
            margin-left: 0px;
          }
      }
  `;
  
  const WalleyHomeContainer = styled.div`
      background: url("https://img.freepik.com/free-vector/abstract-black-shapes-background-design_1017-31904.jpg?w=826&t=st=1692784084~exp=1692784684~hmac=640a88623947cac46d90337f2d03281af01efcdcd5aa64901719774754bd75b3");
      background-size: cover;
      font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      height: 100vh;
      width: 100vw;
      ::placeholder {
        color: rgb(255, 255, 255, 0.5);
      }
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0px;
      @media screen and (max-width: 600px) {
        background-position: 70% 70%;
      }
  `;
  
  const WalleyHomeHeader = styled.div`
      width: 100%;
      font-size: 25px;
      font-weight: 900;
      padding: 8px;
      padding-bottom: 0px;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      &>p {
        text-align: center;
      }
  
  `;
  
  const WalleyHomeMain = styled.div`
      padding: 15px;
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      align-items: space-between;
      @media screen and (max-width: 600px) {
        flex-direction: column;
      }
  `;
  
  const WalleyNavbar = styled.div`
      padding: 15px;
      display: flex;
      flex-direction: column;
      position: relative;
      left: 0px;
      height: 100%;
      text-align: left;
      &>svg {
        text-align: left; 
        padding: 0;
        width: 24px;
        display: none;
      }
      @media screen and (max-width: 600px) {
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;
          text-align: center;
          font-size: 12px;
      }
  `;
  
  const WalleyNavbarButton = styled.button`
      border: none;
      text-align: left;
      background: none;
      color: #fff;
      padding:0px;
      font-weight: 500;
  `;
  
  const NavLine = styled.span`
    width: 1px;
    height: 70px;
    background: white;
    margin: 4px 0 4px 0;
    @media screen and (max-width: 600px) {
      display: none;
    }
  `;
  const NavLineLast = styled.span`
    width: 1px;
    height: 100%;
    background: white;
    margin: 4px 0 4px 0;
    @media screen and (max-width: 600px) {
      display: none;
    }
  `;
  
  const WalleyHomeBody = styled.div`
    width: 100%;
    padding: 0px 8px;
    &>.txn {
      text-align: left;
      font-size: 15px;
      font-weight: 600;
      padding: 20px 0px 0px 0px;
    }
  `;
  
  const WalleyBalance = styled.span`
    padding: 5px;
    font-weight: 500;
    font-size: 12px;
    width: 120px;
    background-color: #424242;
    border-radius: 30px;
    text-align: center;
    box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
    &>svg {
      fill: #fff;
    }
  `;
  
  const WalleyLoading = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;
    background: rgb(66, 66, 66, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    test-align: center;
    font-weight: 400;
  `;
  
  const WalleyModal = styled.div`
    width: 400px;
    height: 400px;
    background: rgb(66, 66, 66);
    box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 20px;
    &>img {
      width: 70px;
      height: 70px;
    }
    @media screen and (max-width: 500px) {
      width: 340px;
      height: 340px;
    }
  
  `;
  
  const WalleyButton = styled.button`
    background-color: ${(props) => props.bg};
    color: ${(props) => props.color};
    display: block;
    width: 100%;
    border-radius: 20px;
    padding: 7px;
    border: 0px;
    font-weight: 500;
    box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
  
  `;
  
  const WalleyHomeOverlay = styled.div`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000000;
    background: rgb(66, 66, 66, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    test-align: center;
  `;
  
  const WalleyHomeForm = styled.div`
    background: rgb(66, 66, 66);
    box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
    width: 400px;
    border-radius: 20px;
    text-align: center;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(1, 1fr);
    flex-direction: column;
    padding: 20px;
    &>input {
      margin-bottom: 5px;
      border: 2px solid #555;
    }
    div[type="button"] {
      border-radius: 20px;
      background: none;
      border: 2px solid #555;
      color: white;
    }
  `;
  
  const WalleyStoreOverlay = WalleyHomeOverlay;
  const WalleyStoreForm = WalleyHomeForm;
  
  const WalleyImageContainer = styled.div`
    text-align: center;
    width: 200px;
    height: 200px;
    @media screen and (max-width: 600px) {
      width: 100%;
      height: 50%;
    }
  `;
  
  const WalleyStoreImage = styled.img`
    maring: 0 auto;
    width: 200px;
    text-align: center;
  `;
  
  const WalleyInput = styled.input`
    display: block;
    width: 100%;
    padding: 6px;
    border-radius: 20px;
    background: none;
    border: 2px solid rgb(66, 66, 66);
    color: white;
  `;
  
  const WalleyLabel = styled.p`
    width: 100%;
  `;
  
  const WalleyStoreButton = styled.button`
    border: none;
    background: none;
    color: #5290f2;
    display: block;
  `;
  
  const WalleyTransactions = styled.div`
    height: auto;
    margin-bottom: 20px;
    overflow-y: scroll;
    padding: 0px 15px 15px 15px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    justiy-content: space-evenly;
    @media screen and (max-width: 750px) {
      grid-template-columns: repeat(1, 1fr);
    }
    &::-webkit-scrollbar {
      width: 7px;
    }
  
    &::-webkit-scrollbar-track {
      background: rgb(66,66,66,0.6); 
    }
    
    &::-webkit-scrollbar-thumb {
      background: #424242; 
    }
  `;
  
  const WalleySearch = styled.div`
    display: flex;
    padding: 0px 10px;
    flex-direction: row;
    @media screen and (max-width: 600px) {
      flex-direction: column-reverse;
    }
    &>button {
      width: 150px;
      margin-right: 20px;
      font-size: 16px;
      @media screen and (max-width: 600px) {
        width: 100%;
        margin-right: 0px;
        font-size: 13px;
        margin-top: 5px;
      }
    }
    &>input {
      font-size: 16px;
      @media screen and (max-width: 400px) {
        width: 100%;
        font-size: 13px;
      }
    }
  `;
  
  const TransactionCard = styled.div`
    background: rgb(66, 66, 66, 0.6);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
    border: 1px solid #424242;
    border-radius: 20px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  `;
  
  const TransactionCardMain = styled.div`
  `;
  
  const WalleyStoreBody = styled.div`
  `;
  
  const sender = Ethers.send("eth_requestAccounts", [])[0];
  const updateBalance = (balance) => {
    State.update({ balance });
  };
  if (!sender) {
    return (
      <Root>
        <WalleyIndexContainer>
          <WalleyTitle>Walley.</WalleyTitle>
          <WalleyIndexBody>
            <WalleyIndexDesc>
              Go Phoneless With the Highly Secured NFT-based Wallet.
            </WalleyIndexDesc>
            <WalleyIndexMain>
              <span>Get Started -</span>
              <Web3Connect connectLabel="Connect Wallet" />
            </WalleyIndexMain>
          </WalleyIndexBody>
        </WalleyIndexContainer>
      </Root>
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
  if (state.store.stores.length === 0 && nftContract && sender) {
    walleyContract.getToken().then((tokenId) => {
      console.log(tokenId);
    });
    State.update({ loading: true, loadingMsg: "Fetching Stores" });
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
          if (store[1].toLowerCase() === sender) {
            storeState.isStore = true;
            storeState.storeName = store[0];
            storeState.storeAddress = store[1].toLowerCase();
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
    State.update({ loading: true, loadingMsg: "Creating a new store" });
    const stateT = state;
    const { storeName, storeAddress, image } = stateT.storeInputs;
    nftContract.addStore(storeName, storeAddress, image.cid).then((t) => {
      console.log(t);
      t.wait().then((r) => {
        stateT.store.stores.push([
          storeName,
          storeAddress.toLowerCase(),
          image.cid,
        ]);
        stateT.store.storeImages[storeName] = image.cid;
  
        stateT.storeInputs = {
          storeName: "",
          storeAddress: "",
          image: "",
        };
        stateT.loading = false;
        stateT.loadingMsg = "";
        if (storeAddress.toLowerCase() === sender) {
          // alert(
          //   "Warning - If you have any pending transactions, you won't be able to see them. But they can be completed at the store!"
          // );
          stateT.store.isStore = true;
          stateT.store.storeAddress = storeAddress.toLowerCase();
          stateT.store.storeName = storeName;
        }
        State.update(stateT);
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
      loading: true,
      loadingMsg: "Minting your NFT - Please Pay the gas price",
    });
    const { storeName, amount, name, password } = state.homeInputs;
    walleyContract
      .mint({ from: sender })
      .then((tx) => {
        State.update({ loadingMsg: "Waiting for confirmation" });
        tx.wait().then((r) => {
          const tokenId = parseInt(r.logs[2].data, 16);
          State.update({
            loadingMsg:
              "Creating your transaction - Please pay the amount you entered + gas",
          });
          addPassword(tokenId, password).then((data) => {

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
                        State.update({ loadingMsg: "Waiting for the final confirmation" });
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
            })
      .catch((err) => console.log(err));
  };
  
  const cancelTransaction = (tokenId) => {
    checkPassword(tokenId, state.user.transactionPassword, () => {

        State.update({
          loading: true,
          loadingMsg: "Cancelling your transaction - Pay for the gas",
        });
        nftContract
        .cancelTransaction(walleyAddress, tokenId, { from: sender })
        .then((tx) => {
            State.update({ loadingMsg: "Refunding your amount" });
            tx.wait().then((r) => {
                const tmp = [];
                state.store.userPendingTransactions.map((trans) => {
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
                        viewTxn: null,
                    },
                });
            });
        });
        
    })
    };
  
  const approveTransaction = (tokenId) => {
    checkPassword(tokenId,state.store.approvePassword,() => {
        State.update({
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
                  viewTxn: null,
                  approvePassword: "",
                  bill: { uploading: false, amount: null },
                  totalAmount: 0,
                },
                loadingMsg: "",
                loading: false,
              });
            });
          });
      })
  };
  
  const transferToken = (tokenId) => {
    checkPassword(tokenId,state.user.cancelPassword, () => {
        State.update({
        loading: true,
        loadingMsg: "Cancelling your transaction - Pay for the gas",
        });
        nftContract.transferNFT(walleyAddress, tokenId, state.user.transferTo, { from: sender }).then(tx => {
        State.update({
            loadingMsg: "Waiting for confirmation - Refunding the change",
        });
        tx.wait().then((res) => {
            State.update({
                user: {
                    ...state.user, 
                    userPendingTransactions: state.user.userPendingTransactions.filter(tx => parseInt(tx[1],16) !== tokenId), 
                    viewTxn: null,
                    transferTo: ""
                },
                loading: true,
                loadingMsg: ""
            })
        })
        })
    })
  }

  const addPassword = (tokenId, password) => {
    return asyncFetch("https://walley-server.onrender.com/", {
        body: JSON.stringify({tokenId, password}),
        method: "POST"
    })
  }
  const checkPassword = (tokenId, password, fn) => {
    asyncFetch("https://walley-server.onrender.com/", {
        body: JSON.stringify({tokenId, password}),
        method: "GET"
    }).then(res => {
        if (res.body.check) { fn() }
        else console.log("Incorrect Password")
    })
  }

  return (
    <WalleyHomeContainer>
      <WalleyHomeHeader>
        <p>Walley.</p>
        <WalleyBalance>
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
        </WalleyBalance>
      </WalleyHomeHeader>
      <WalleyHomeMain>
        {state.loading ? (
          <WalleyLoading>
            <WalleyModal>
              <img src="https://svgshare.com/i/wuF.svg" title="" />
              <p>{state.loadingMsg}</p>
            </WalleyModal>
          </WalleyLoading>
        ) : (
          ""
        )}
        {!state.store.isStore ? (
          <>
            <WalleyNavbar>
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
              <NavLine></NavLine>
              <WalleyNavbarButton onClick={() => State.update({ view: "home" })}>
                <span>Home</span>
              </WalleyNavbarButton>
              <NavLine></NavLine>
              <WalleyNavbarButton onClick={onTxPastClick}>
                <span>Receipts</span>
              </WalleyNavbarButton>
              <NavLine></NavLine>
              <WalleyNavbarButton onClick={() => State.update({ addSt: true })}>
                <span>Add a store</span>
              </WalleyNavbarButton>
              <NavLineLast></NavLineLast>
            </WalleyNavbar>
            <WalleyHomeBody>
              {state.newTxn ? (
                <WalleyHomeOverlay
                  id="overlay"
                  onClick={(e) => {
                    if ("overlay" === e.target.id) {
                      State.update({ newTxn: false });
                    }
                  }}
                >
                  <WalleyHomeForm>
                    <WalleyLabel>Select a Store</WalleyLabel>
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
                    <WalleyLabel>
                      Enter the maximum amount you'd like to spend(in INR)
                    </WalleyLabel>
                    <WalleyInput
                      value={state.homeInputs.amount}
                      type="number"
                      onChange={(e) => homeInputUpdates(e.target.value, "amount")}
                      placeholder="Amount(in INR)"
                    />
                    <WalleyLabel>Name(will be asked at the store)</WalleyLabel>
                    <WalleyInput
                      value={state.homeInputs.name}
                      type="text"
                      onChange={(e) => homeInputUpdates(e.target.value, "name")}
                      placeholder="Name"
                    />
                    <WalleyLabel>
                      Set a password for the transaction(will be asked during
                      checkout)
                    </WalleyLabel>
                    <WalleyInput
                      value={state.homeInputs.password}
                      type="password"
                      onChange={(e) =>
                        homeInputUpdates(e.target.value, "password")
                      }
                      placeholder="Password"
                    />
                    <WalleyButton
                      color="#fff"
                      bg="#FFA500"
                      onClick={initTransaction}
                    >
                      Buy The Store NFT
                    </WalleyButton>
                  </WalleyHomeForm>
                </WalleyHomeOverlay>
              ) : (
                ""
              )}
              {state.addSt ? (
                <WalleyStoreOverlay
                  id="overlay"
                  onClick={(e) => {
                    if ("overlay" === e.target.id) {
                      State.update({ addSt: false });
                    }
                  }}
                >
                  <WalleyStoreForm>
                    <WalleyLabel>Store Name</WalleyLabel>
                    <WalleyInput
                      value={state.storeInputs.storeName}
                      type="text"
                      onChange={(e) => {
                        storeInputUpdates(e.target.value, "storeName");
                      }}
                      placeholder="Enter the Store Name"
                    />
                    <WalleyLabel>Store Address</WalleyLabel>
                    <WalleyInput
                      value={state.storeInputs.storeAddress}
                      type="text"
                      onChange={(e) =>
                        storeInputUpdates(e.target.value, "storeAddress")
                      }
                      placeholder="Enter the Store Address"
                    />
                    <WalleyStoreButton
                      onClick={() => storeInputUpdates(sender, "storeAddress")}
                    >
                      Use current address(convert this account into a store)
                    </WalleyStoreButton>
                    <WalleyLabel>Add Cover Image</WalleyLabel>
                    <IpfsImageUpload image={state.storeInputs.image} />
                    <WalleyButton color="#fff" bg="#FA9703" onClick={addStore}>
                      Add Store
                    </WalleyButton>
                  </WalleyStoreForm>
                </WalleyStoreOverlay>
              ) : (
                ""
              )}
              {state.viewTxn ? (
                <TransactionModal
                  id="#modal"
                  onClick={(e) => {
                    if (e.target.id === "overlay")
                      State.update({
                        user: {
                          ...state.user,
                          viewTxn: null,
                          transactionPassword: "",
                        },
                      });
                  }}
                >
                  <TransactionCard>
                    <WalleyImageContainer>
                      <WalleyStoreImage
                        src={`https://ipfs.near.social/ipfs/${
                          state.store.storeImages[state.viewTxn[6]]
                        }`}
                        alt={state.viewTxn[6]}
                      />
                    </WalleyImageContainer>
                    <TransactionCardMain>
                      <p>Name - {state.viewTxn[2]}</p>
                      <p>Store name - {state.viewTxn[6]} </p>
                      <p>Amount - {Big(state.viewTxn[5]).toFixed(5)}</p>
                      <p>Time - {unixToDate(parseInt(state.viewTxn[10], 16))}</p>
                      {state.viewTxn[11] === "cancel" ? (
                        <>
                          <WalleyLabel>
                            Enter the transaction password
                          </WalleyLabel>
                          <WalleyInput
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
                          <WalleyButton
                            color="white"
                            bg="blue"
                            onClick={() =>
                              State.update({
                                user: {
                                  ...state.user,
                                  viewTxn: null,
                                  transactionPassword: "",
                                },
                              })
                            }
                          >
                            Close
                          </WalleyButton>
                          <WalleyButton
                            color="white"
                            bg="red"
                            onClick={() =>
                              cancelTransaction(parseInt(state.viewTxn[1], 16))
                            }
                          >
                            Cancel
                          </WalleyButton>
                        </>
                      ) : state.viewTxn[11] === "transfer" ? (
                        <>
                          <WalleyLabel>
                            Enter the transaction password
                          </WalleyLabel>
                          <WalleyInput
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
                          <WalleyLabel>Enter the Receiver's Address</WalleyLabel>
                          <WalleyInput
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
                          <WalleyButton
                            color="white"
                            bg="blue"
                            onClick={() =>
                              State.update({
                                user: {
                                  ...state.user,
                                  viewTxn: null,
                                  transactionPassword: "",
                                },
                              })
                            }
                          >
                            Close
                          </WalleyButton>
                          <WalleyButton
                            color="white"
                            bg="red"
                            onClick={() =>
                              transferToken(parseInt(state.viewTxn[1], 16))
                            }
                          >
                            Transfer
                          </WalleyButton>
                        </>
                      ) : (
                        <>
                          <WalleyLabel>Please upload the bill - </WalleyLabel>
                          <IpfsImageUpload image={state.store.bill} />
                          <WalleyLabel>Total Bill Amount</WalleyLabel>
                          <WalleyInput
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
                          <WalleyLabel>Transaction Password</WalleyLabel>
                          <WalleyInput
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
                          <WalleyButton
                            color="white"
                            bg="blue"
                            onClick={() => {
                              State.update({
                                store: {
                                  ...state.store,
                                  approvePassword: "",
                                  bill: { uploading: false, cid: "" },
                                  totalAmount: null,
                                  viewTxn: null,
                                },
                              });
                            }}
                          >
                            Close
                          </WalleyButton>
                          <WalleyButton
                            color="white"
                            bg="blue"
                            onClick={() => {
                              console.log(state.store.bill.cid);
                              if (state.store.bill.cid) {
                                approveTransaction(parseInt(state.viewTxn[1], 16));
                              } else {
                                console.log("Please Upload the bill");
                              }
                            }}
                          >
                            Approve
                          </WalleyButton>
                        </>
                      )}
                    </TransactionCardMain>
                  </TransactionCard>
                </TransactionModal>
              ) : (
                ""
              )}
              {state.view === "home" ? (
                <>
                  <WalleySearch>
                    <WalleyButton
                      bg="#424242"
                      color="white"
                      onClick={() => State.update({ newTxn: true })}
                    >
                      Buy New NFT
                    </WalleyButton>
                    <WalleyInput
                      value={state.search.store}
                      onChange={(e) =>
                        State.update({
                          search: { ...state.search, store: e.target.value },
                        })
                      }
                      placeholder="Search Transactions by Store Name"
                    />
                  </WalleySearch>
                  <p className="txn">Your Transactions</p>
                  <WalleyTransactions>
                    {state.user.userPendingTransactions.length !== 0
                      ? state.user.userPendingTransactions
                          .filter((tx) =>
                            tx[6]
                              .toLowerCase()
                              .includes(state.search.store.toLowerCase())
                          )
                          .map((tx) => (
                            <TransactionCard>
                              <WalleyImageContainer>
                                <WalleyStoreImage
                                  src={`https://ipfs.near.social/ipfs/${
                                    state.store.storeImages[tx[6]]
                                  }`}
                                  alt={tx[6]}
                                />
                              </WalleyImageContainer>
                              <TransactionCardMain>
                                <p>Name - {tx[2]}</p>
                                <p>Store name - {tx[6]} </p>
                                <p>Amount - {Big(tx[5]).toFixed(5)}</p>
                                <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                                <WalleyButton
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
                                </WalleyButton>
                                <WalleyButton
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
                                </WalleyButton>
                              </TransactionCardMain>
                            </TransactionCard>
                          ))
                      : "No pending transactions found"}
                  </WalleyTransactions>
                </>
              ) : state.view === "txPast" ? (
                <>
                  <WalleySearch>
                    <WalleyButton
                      bg="#424242"
                      color="white"
                      onClick={() => State.update({ newTxn: true })}
                    >
                      Buy New NFT
                    </WalleyButton>
                    <WalleyInput
                      value={state.search.store}
                      onChange={(e) =>
                        State.update({
                          search: { ...state.search, store: e.target.value },
                        })
                      }
                      placeholder="Search Transactions by Store Name"
                    />
                  </WalleySearch>
                  <p className="txn">Your Receipts</p>
                  <WalleyTransactions>
                    {state.user.userPastTransactions.length !== 0
                      ? state.user.userPastTransactions
                          .filter((tx) =>
                            tx[6]
                              .toLowerCase()
                              .includes(state.search.store.toLowerCase())
                          )
                          .map((tx) => (
                            <TransactionCard>
                              <WalleyImageContainer>
                                <WalleyStoreImage
                                  src={`https://ipfs.near.social/ipfs/${
                                    state.store.storeImages[tx[6]]
                                  }`}
                                  alt={tx[6]}
                                />
                              </WalleyImageContainer>
                              <TransactionCardMain>
                                <p>Name - {tx[2]}</p>
                                <p>Store name - {tx[6]} </p>
                                <p>Max Amount - {Big(tx[5]).toFixed(5)}</p>
                                <p>Total Bill Amount - {Big(tx[9]).toFixed(5)}</p>
  
                                <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                                {state.user.openReceipt ===
                                Big(tx[1]).toFixed(0) ? (
                                  <>
                                    <WalleyStoreImage
                                      src={`https://ipfs.near.social/ipfs/${tx[7]}`}
                                      alt={tx[7]}
                                    />
                                    <WalleyButton
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
                                    </WalleyButton>
                                  </>
                                ) : (
                                  <WalleyButton
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
                                  </WalleyButton>
                                )}
                              </TransactionCardMain>
                            </TransactionCard>
                          ))
                      : "No past transactions found"}
                  </WalleyTransactions>
                </>
              ) : (
                ""
              )}
            </WalleyHomeBody>
          </>
        ) : (
          <>
            <WalleyNavbar>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none">
                <path
                  d="M42.3795 1.00041H3.49873C-0.658836 0.841665 -0.658836 7.16116 3.49873 7.00242H42.2245C46.3065 7.16116 46.4652 1.00041 42.3833 1.00041H42.3795ZM3.49873 25.0009C-0.500093 25.0009 -0.500093 30.9991 3.49873 30.9991H25.4204C29.5024 30.9991 29.5024 25.0009 25.4204 25.0009H3.49873ZM3.49873 49.0014C-0.500093 49.0014 -0.500093 54.9996 3.49873 54.9996H52.6222C56.621 54.9996 56.621 49.0014 52.6222 49.0014H3.49873Z"
                  fill="white"
                />
              </svg>
              <NavLine></NavLine>
              <WalleyNavbarButton onClick={() => State.update({ view: "home" })}>
                <span>Home</span>
              </WalleyNavbarButton>
              <NavLine></NavLine>
              <WalleyNavbarButton
                onClick={() => State.update({ view: "txPast" })}
              >
                <span>Receipts</span>
              </WalleyNavbarButton>
              <NavLineLast></NavLineLast>
            </WalleyNavbar>
            <WalleyStoreBody>
              <WalleyTransactions>
                {state.view === "home"
                  ? state.store.storePendingTransactions.length !== 0
                    ? state.store.storePendingTransactions.map((tx) => (
                        <TransactionCard>
                          <WalleyImageContainer>
                            <WalleyStoreImage
                              src={`https://ipfs.near.social/ipfs/${
                                state.store.storeImages[tx[6]]
                              }`}
                              alt={tx[6]}
                            />
                          </WalleyImageContainer>
                          <TransactionCardMain>
                            <p>Name - {tx[2]}</p>
                            <p>Store name - {tx[6]} </p>
                            <p>Max amount - {Big(tx[5]).toFixed(5)}</p>
  
                            <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                            <WalleyButton
                              color="white"
                              bg="blue"
                              onClick={() =>
                                State.update({
                                  store: {
                                    ...state.store,
                                    approvePassword: "",
                                    bill: { uploading: false, amount: null },
                                    totalAmount: null,
                                    viewTxn: [...tx, "approve"],
                                  },
                                })
                              }
                            >
                              Approve
                            </WalleyButton>
                          </TransactionCardMain>
                        </TransactionCard>
                      ))
                    : "No pending transactions"
                  : state.store.storePastTransactions.length !== 0
                  ? state.store.storePastTransactions.map((tx) => (
                      <TransactionCard>
                        <WalleyImageContainer>
                          <WalleyStoreImage
                            src={`https://ipfs.near.social/ipfs/${
                              state.store.storeImages[tx[6]]
                            }`}
                            alt={tx[6]}
                          />
                        </WalleyImageContainer>
                        <TransactionCardMain>
                          <p>Name - {tx[2]}</p>
                          <p>Store name - {tx[6]} </p>
                          <p>Max Amount - {Big(tx[5]).toFixed(5)}</p>
  
                          <p>Total Bill Amount - {Big(tx[9]).toFixed(5)}</p>
  
                          <p>Time - {unixToDate(parseInt(tx[10], 16))}</p>
                          {state.user.openReceipt === Big(tx[1]).toFixed(0) ? (
                            <>
                              <WalleyStoreImage
                                src={`https://ipfs.near.social/ipfs/${tx[7]}`}
                                alt={tx[7]}
                              />
                              <WalleyButton
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
                              </WalleyButton>
                            </>
                          ) : (
                            <WalleyButton
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
                            </WalleyButton>
                          )}
                        </TransactionCardMain>
                      </TransactionCard>
                    ))
                  : "No past transactions found"}
              </WalleyTransactions>
            </WalleyStoreBody>
          </>
        )}
      </WalleyHomeMain>
    </WalleyHomeContainer>
  );
  
  
const Styles = {
  Root : styled.div`
     
       background: url("https://img.freepik.com/free-vector/abstract-black-shapes-background-design_1017-31904.jpg?w=826&t=st=1692784084~exp=1692784684~hmac=640a88623947cac46d90337f2d03281af01efcdcd5aa64901719774754bd75b3");
       background-size: cover;
       display: flex;
       font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
       flex-direction: column;
       padding: 0;
       align-items: center;
       justify-content: center;
       box-sizing: border-box;
       height: 100vh;
       width: 100vw;
       @media screen and (max-width: 600px) {
         background-position: 70% 70%;
       }
   `,
 
  WalleyTitle : styled.div`
       text-align: left;
       font-weight: 900;
       width: 100%;
       font-size: 30px;
       margin: 0px;
       padding: 5px;
       color: #fff; 
       @media screen and (max-width: 600px) {
         text-align: center;
       }
   `,
 
  WalleyIndexContainer : styled.div`
       height: 100vh;
       color: #fff;
       width: 100%;
       padding: 20px;
       display: flex;
       flex-direction: column;
   `,
 
  WalleyIndexBody : styled.div`
     display: flex;
     flex-direction: column;
     text-align: left;
     width: 500px;
     padding-left: 50px;
     @media screen and (max-width:600px) {
       width: 100%;
       padding-left: 0;
       align-items: center;
     }
   `,
 
  WalleyIndexDesc : styled.div`
       color: #fff;
       font-weight: 500;
       font-size: 50px;
       padding-bottom: 10px;
       margin-top: 50px;
       @media screen and (max-width: 400px) {
         margin-top: 150px;
         font-size: 40px;
       }
   `,
 
  WalleyIndexMain : styled.div`
       margin-top: 20px;
       width: 100%;
       padding: 20px;
       @media screen and (max-width: 600px) {
         text-align: center;
         position: fixed;
         bottom: 0px;
         left: 0px;
       }
       &>span {
         font-weight: 500;
         @media screen and (max-width: 600px) {
           display: none;
           width: 0px;
         }
       }
       &>button {
           border: none;
           background: #FA9703;
           color: white;
           margin-left: 20px;
           transition: all .2s ease-out;
           &:hover {
             scale: 1.05;
             background:#FA9703;
           }
           &:active {
             background:#FA9703;
           }
           @media screen and (max-width: 600px) {
             width: 100%;
             height: 50px;
             font-size: 15px;
             display: block;
             margin-left: 0px;
           }
       }
   `,
 
  WalleyHomeContainer : styled.div`
       background: url("https://img.freepik.com/free-vector/abstract-black-shapes-background-design_1017-31904.jpg?w=826&t=st=1692784084~exp=1692784684~hmac=640a88623947cac46d90337f2d03281af01efcdcd5aa64901719774754bd75b3");
       background-size: cover;
       font-family: Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
       height: 100vh;
       width: 100vw;
       ::placeholder {
         color: rgb(255, 255, 255, 0.5);
       }
       color: #fff;
       display: flex;
       flex-direction: column;
       position: fixed;
       top: 0px;
       @media screen and (max-width: 600px) {
         background-position: 70% 70%;
       }
   `,
 
  WalleyHomeHeader : styled.div`
       width: 100%;
       font-size: 25px;
       font-weight: 900;
       padding: 8px;
       padding-bottom: 0px;
       color: #fff;
       display: flex;
       flex-direction: column;
       justify-content: space-around;
       &>p {
         text-align: center;
       }
   
   `,
 
  WalleyHomeMain : styled.div`
       padding: 15px;
       display: flex;
       flex-direction: row;
       width: 100%;
       height: 100%;
       align-items: space-between;
       @media screen and (max-width: 600px) {
         flex-direction: column;
       }
   `,
 
  WalleyNavbar : styled.div`
       padding: 15px;
       display: flex;
       flex-direction: column;
       position: relative;
       left: 0px;
       height: 100%;
       text-align: left;
       &>svg {
         text-align: left; 
         padding: 0;
         width: 24px;
         display: none;
       }
       @media screen and (max-width: 600px) {
           flex-direction: row;
           justify-content: space-evenly;
           align-items: center;
           text-align: center;
           font-size: 12px;
       }
   `,
 
  WalleyNavbarButton : styled.button`
       border: none;
       text-align: left;
       background: none;
       color: #fff;
       padding:0px;
       font-weight: 500;
   `,
 
  NavLine : styled.span`
     width: 1px;
     height: 70px;
     background: white;
     margin: 4px 0 4px 0;
     @media screen and (max-width: 600px) {
       display: none;
     }
   `,
  NavLineLast : styled.span`
     width: 1px;
     height: 100%;
     background: white;
     margin: 4px 0 4px 0;
     @media screen and (max-width: 600px) {
       display: none;
     }
   `,
 
  WalleyHomeBody : styled.div`
     width: 100%;
     padding: 0px 8px;
     &>.txn {
       text-align: left;
       font-size: 15px;
       font-weight: 600;
       padding: 20px 0px 0px 0px;
     }
   `,
 
  WalleyBalance : styled.span`
     padding: 5px;
     font-weight: 500;
     font-size: 12px;
     width: 120px;
     background-color: #424242;
     border-radius: 30px;
     text-align: center;
     box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
     &>svg {
       fill: #fff;
     }
   `,
 
  WalleyLoading : styled.div`
     width: 100vw;
     height: 100vh;
     position: fixed;
     top: 0;
     left: 0;
     z-index: 1000000;
     background: rgb(66, 66, 66, 0.7);
     display: flex;
     justify-content: center;
     align-items: center;
     test-align: center;
     font-weight: 400;
   `,
 
  WalleyModal : styled.div`
     width: 400px;
     height: 400px;
     background: rgb(66, 66, 66);
     box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
     text-align: center;
     border-radius: 20px;
     &>img {
       width: 70px;
       height: 70px;
     }
     @media screen and (max-width: 500px) {
       width: 340px;
       height: 340px;
     }
   
   `,
 
  WalleyButton : styled.button`
     background-color: ${(props) => props.bg};
     color: ${(props) => props.color};
     display: block;
     width: 100%;
     border-radius: 20px;
     padding: 7px;
     border: 0px;
     font-weight: 500;
     box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
   
   `,
 
  WalleyHomeOverlay : styled.div`
     width: 100vw;
     height: 100vh;
     position: fixed;
     top: 0;
     left: 0;
     z-index: 1000000;
     background: rgb(66, 66, 66, 0.7);
     display: flex;
     justify-content: center;
     align-items: center;
     test-align: center;
   `,
 
  WalleyHomeForm : styled.div`
     background: rgb(66, 66, 66);
     box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
     width: 400px;
     border-radius: 20px;
     text-align: center;
     display: grid;
     grid-gap: 5px;
     grid-template-columns: repeat(1, 1fr);
     flex-direction: column;
     padding: 20px;
     &>input {
       margin-bottom: 5px;
       border: 2px solid #555;
     }
     div[type="button"] {
       border-radius: 20px;
       background: none;
       border: 2px solid #555;
       color: white;
     }
   `,
 
  WalleyStoreOverlay : styled.div`
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000000;
      background: rgb(66, 66, 66, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      test-align: center;
  `,
  WalleyStoreForm : styled.div`
      background: rgb(66, 66, 66);
      box-shadow: rgb(0, 0, 0, 0.19) 0px 10px 20px, rgb(0, 0, 0, 0.23) 0px 6px 6px;
      width: 400px;
      border-radius: 20px;
      text-align: center;
      display: grid;
      grid-gap: 5px;
      grid-template-columns: repeat(1, 1fr);
      flex-direction: column;
      padding: 20px;
      &>input {
      margin-bottom: 5px;
      border: 2px solid #555;
      }
      div[type="button"] {
      border-radius: 20px;
      background: none;
      border: 2px solid #555;
      color: white;
      }
  `,
 
  WalleyImageContainer : styled.div`
     text-align: center;
     width: 200px;
     height: 200px;
     @media screen and (max-width: 600px) {
       width: 100%;
       height: 50%;
     }
   `,
 
  WalleyStoreImage : styled.img`
     maring: 0 auto;
     width: 200px;
     text-align: center;
   `,
 
  WalleyInput : styled.input`
     display: block;
     width: 100%;
     padding: 6px;
     border-radius: 20px;
     background: none;
     border: 2px solid rgb(66, 66, 66);
     color: white;
   `,
 
  WalleyLabel : styled.p`
     width: 100%;
   `,
 
  WalleyStoreButton : styled.button`
     border: none;
     background: none;
     color: #5290f2;
     display: block;
   `,
 
  WalleyTransactions : styled.div`
     height: auto;
     margin-bottom: 20px;
     overflow-y: scroll;
     padding: 0px 15px 15px 15px;
     display: grid;
     grid-gap: 20px;
     grid-template-columns: repeat(2, 1fr);
     justiy-content: space-evenly;
     @media screen and (max-width: 750px) {
       grid-template-columns: repeat(1, 1fr);
     }
     &::-webkit-scrollbar {
       width: 7px;
     }
   
     &::-webkit-scrollbar-track {
       background: rgb(66,66,66,0.6); 
     }
     
     &::-webkit-scrollbar-thumb {
       background: #424242; 
     }
   `,
 
  WalleySearch : styled.div`
     display: flex;
     padding: 0px 10px;
     flex-direction: row;
     @media screen and (max-width: 600px) {
       flex-direction: column-reverse;
     }
     &>button {
       width: 150px;
       margin-right: 20px;
       font-size: 16px;
       @media screen and (max-width: 600px) {
         width: 100%;
         margin-right: 0px;
         font-size: 13px;
         margin-top: 5px;
       }
     }
     &>input {
       font-size: 16px;
       @media screen and (max-width: 400px) {
         width: 100%;
         font-size: 13px;
       }
     }
   `,
 
  TransactionCard : styled.div`
     background: rgb(66, 66, 66, 0.6);
     box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
     border: 1px solid #424242;
     border-radius: 20px;
     padding: 30px;
     display: flex;
     flex-direction: row;
     gap: 20px;
     @media screen and (max-width: 600px) {
       flex-direction: column;
     }
   `,
 
  TransactionCardMain : styled.div`
   `,
 
  WalleyStoreBody : styled.div`
   `
 }
