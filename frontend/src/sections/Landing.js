import axios from "axios";
import "../styles/landing.css";
import { URL } from "../constants";
import { useQuery } from "react-query";
import loadable from "@loadable/component";
const ScrollTextLand = loadable(() => import("../components/ScrollTextLand"));

const Landing = () => {
  //

  const walletAddress = localStorage.getItem("address");

  const { isLoading, error, data } = useQuery(
    "committed",
    () =>
      axios
        .get(`${URL}/committed/${walletAddress}`)
        .then((response) => response.data.data),
    {
      enabled: !!walletAddress,
    }
  );

  return (
    <div className="landing" id="landing">
      <ScrollTextLand
        word={
          "Crawford University Electronic Elections using the Algorand Blockchain"
        }
      />
      <div
        style={{
          width: "100%",
          height: "20px",
          fontSize: "13px",
          fontWeight: "500",
          marginTop: "10px",
          textTransform: "uppercase",
        }}
      >
        Total amount committed to voting:{" "}
        {!isLoading && !error && data?.amount ? data?.amount / 10000 : 0} $ALGO
      </div>

      <div className="land_cov">
        <div className="land_item1">
          <div className="icon_title">
            <p className="hdy">Crawford University Electronic Elections</p>
          </div>

          <p className="suby">
            Crawford University Electronic Elections using the Algorand
            Blockchain
            <br />
            <br />
            Platfrom for Decentralized Decisions to enable students create,
            explore and participate in elections anonymously.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
