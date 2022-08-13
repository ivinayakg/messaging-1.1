import { Route, Routes } from "react-router-dom";
import { getFromStorage } from "../../services/localstorage";
import Channel from "../components/channel";
import Sidebar from "./sidebar";
import classes from "./index.module.css";
import axios from "../../services/api";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { createTokenHeader } from "../../services/utils";

const Homepage = () => {
  const token = getFromStorage("token");
  const queryClient = useQueryClient();

  useEffect(() => {
    async function longPollingHandler() {
      const res = await axios.get(
        "/messages/polling",
        createTokenHeader(getFromStorage("token"))
      );
      let messageDoc = res.data.data;
      queryClient.setQueryData(
        `single-channel-${messageDoc.channelId}`,
        (data) => {
          return {
            ...data,
            data: {
              ...data.data,
              data: {
                allMessages: [messageDoc, ...data.data.data.allMessages],
              },
            },
          };
        }
      );
      longPollingHandler();
    }
    longPollingHandler();

    return async () => {
      axios.get("/messages/unpoll", createTokenHeader(getFromStorage("token")));
    };
  }, []);

  return (
    <div className={classes.container}>
      <Sidebar />
      <Routes>
        <Route path="/channel">
          <Route index element={<BlankPage />} />
          <Route path="/channel/:channelId" element={<Channel />} />
        </Route>
      </Routes>
    </div>
  );
};

const BlankPage = () => {
  return <div className="blankPage"></div>;
};

export default Homepage;
