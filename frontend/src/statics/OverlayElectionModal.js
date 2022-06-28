import { useSelector, useDispatch } from "react-redux";
import { URL } from "../constants";
import axios from "axios";
import dayjs from "dayjs";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useState } from "react";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const OverlayElectionModal = () => {
  const dispatch = useDispatch();

  const walletAddress = localStorage.getItem("address");

  const { openElectModal, modalData } = useSelector(
    (state) => state.status.electModal
  );

  const [duration, setDuration] = useState(new Date());

  const startElection = () => {
    const diff = dayjs(duration).diff(dayjs());

    if (diff < 0) {
      alert("Provide valid End time for election");
      return;
    }

    const headers = {
      "X-Wallet-Address": walletAddress,
    };

    axios
      .post(
        `${URL}/elections/${modalData.slug}/start`,
        {
          end_at: dayjs(duration).add(1, "hours").format(),
        },
        { headers }
      )
      .then((response) => alert("Election started successfully!"))
      .catch((err) => {
        console.log(err);
        alert("An error occured while starting election");
      });
  };

  const endElection = () => {
    const headers = {
      "X-Wallet-Address": walletAddress,
    };

    axios
      .post(`${URL}/elections/${modalData.slug}/end`, null, { headers })
      .then((response) => alert("Election ended successfully!"))
      .catch((err) => {
        console.log(err);
        alert("An error occured while ending election");
      });
  };

  const DeleteElection = () => {
    const headers = {
      "X-Wallet-Address": walletAddress,
    };

    axios
      .post(`${URL}/elections/${modalData.slug}/delete`, null, { headers })
      .then((res) => alert("Election deleted successfully!"))
      .catch((err) => {
        console.log(err);
        alert("An error occured while deleting election");
      });
  };

  return (
    modalData && (
      <div
        className="modal_cov"
        style={{ display: `${!!openElectModal ? "flex" : "none"}` }}
      >
        <div className="modal_cont">
          <div className="modal_r1">
            <div className="modal_elt_img">
              {modalData?.process_image ? (
                <img src={modalData?.process_image} alt="" />
              ) : (
                <i className="uil uil-mailbox"></i>
              )}
            </div>
            <div className="modal_elt_tit">{modalData.title}</div>
          </div>

          <div className="modal_elt_desc">{modalData.description}</div>

          <div className="modal_cand">
            <div className="modal_cand_hd">Candidates</div>

            <ul className="modal_cand_list">
              {modalData.candidates?.map((item, index) => (
                <li className="cand_item" key={index}>
                  <div className="cand_img_cont">
                    {!!item.image ? (
                      <img src={item.image} alt="" />
                    ) : (
                      <i className="uil uil-asterisk"></i>
                    )}
                  </div>
                  <p className="cand_det">{item.name}</p>
                </li>
              ))}
            </ul>

            <div className="date_time_picker">
              {!modalData?.is_started && !modalData?.is_finished ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Election ends in"
                    value={duration}
                    onChange={(newValue) => {
                      setDuration(newValue);
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <div className="election_ends">
                  {modalData?.is_started &&
                  dayjs(modalData?.end_at).diff(dayjs()) > 1 ? (
                    <p>
                      Election ends by:{" "}
                      {dayjs(modalData?.end_at)
                        .tz(dayjs.tz.guess())
                        .format("DD/MM/YYYY - hh:mm a")}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>

            <div className="modal_butts">
              {!modalData?.is_started && !modalData?.is_finished ? (
                <button onClick={startElection}>Start Election</button>
              ) : !modalData?.is_finished &&
                modalData?.is_started &&
                dayjs(modalData?.end_at).diff(dayjs()) > 1 ? (
                <button>Election in progress</button>
              ) : (
                <button>Election has ended</button>
              )}
              <button
                className="delete_election"
                onClick={() => DeleteElection()}
              >
                Delete Election
              </button>
            </div>
          </div>
        </div>

        <div
          className="close_modal"
          onClick={() => dispatch({ type: "closePopupElection" })}
        >
          Go Back
        </div>
      </div>
    )
  );
};

export default OverlayElectionModal;
