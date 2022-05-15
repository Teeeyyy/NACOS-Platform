import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { indexerClient, myAlgoConnect } from "../utils";
import { useWindowSize } from "@react-hook/window-size/throttled";

const TopNavigationBar = () => {
  const [width] = useWindowSize();

  const [balance, setBalance] = useState(0);

  const walletAddress = localStorage.getItem("address");

  const setMyBalance = async () => {
    const myAccountInfo = await indexerClient
      .lookupAccountByID(walletAddress)
      .do();

    const b = myAccountInfo.account.amount / 1000000;
    setBalance(b);
  };

  useEffect(() => {
    if (!!walletAddress) {
      setMyBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AlgoConnect = async () => {
    try {
      const accounts = await myAlgoConnect.connect({
        shouldSelectOneAccount: true,
      });
      const address = accounts[0].address;

      // close modal.
      localStorage.setItem("wallet-type", "my-algo");
      localStorage.setItem("address", address);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const isWalletConnected =
    localStorage.getItem("wallet-type") === null ? false : true;

  return (
    <header className="small_header">
      <div className="small_header_inn">
        <div className="top_logo">
          <img src="/img/school_logo.jpeg" alt="" />
          {width > 690 ? (
            <p>Crawford University Electronic Elections</p>
          ) : (
            <p>CUE-E</p>
          )}
        </div>

        {!!isWalletConnected ? (
          <div className="addrDisplay">
            <div className="addrDisplayInn">
              <div className="addrBalance">
                <span className="reloadBalance" onClick={setMyBalance}></span>
                {balance} $ALGO
              </div>

              <CopyToClipboard text={walletAddress}>
                <div className="addressTxt">
                  <p>{walletAddress}</p>
                  <i className="uil uil-copy"></i>
                </div>
              </CopyToClipboard>
            </div>
          </div>
        ) : (
          <div className="dropDownConnect">
            <div className="dropDownConnect_button">
              <button className="connect_wallet_button" onClick={AlgoConnect}>
                <p>Connect Wallet</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNavigationBar;
