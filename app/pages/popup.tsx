import * as React from "react";
import { render } from "react-dom";
import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from "@material-ui/core";

import { RingLoader } from "react-spinners";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      minWidth: "500px",
      marginTop: "10px",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    orange: {
      color: "white",
      backgroundColor: "red",
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFirst, setIsFirst] = React.useState(true);
  const [lastDate, setLastDate] = React.useState("");
  const callback: any = (tabs: chrome.tabs.Tab[], message: string) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  };
  const handleClick = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs): any => {
      setIsLoading(true);
      callback(tabs, { message: "UPDATE_CASTDATA" });
    });
  };
  React.useEffect(() => {
    if (isFirst) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs): any => {
        callback(tabs, { message: "GET_LOADING_STATE" });
        callback(tabs, { message: "GET_LAST_DATE" });
      });
      setIsFirst(false);
    }
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request.message === "STORED_CASTDATA") setIsLoading(false);
      if (request.message === "SEND_LAST_DATE") {
        setLastDate(request.date);
      }
      if (request.message === "LOADING_NG") setIsLoading(true);
      if (request.message === "LOADING_OK") setIsLoading(false);
    });
  }, []);
  return (
    <Grid container alignItems="center" justify="center">
      <Grid item xs={12}>
        <Card className={classes.root}>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.orange}>
                    <Typography variant="body1">(^卑^)</Typography>
                  </Avatar>
                }
                title={
                  <Typography variant="h4">wlwダッシュボードver0.1</Typography>
                }
              />
            </Grid>
          </Grid>
          <CardContent>
            <Grid
              container
              alignItems="center"
              justify="center"
              className={classes.root}
            >
              <Grid item xs={12}>
                <Typography variant="body1">
                  キャストごとの戦績をより詳細に見たい人向けの非公式ツールです。ボタンを押下すると最新のキャストのデータを取得します
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="button" display="block" gutterBottom>
                  データ最終取得日：
                  {lastDate ? lastDate : "まだ取得していません"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RingLoader size="40px" loading={isLoading} color="#60ad5e" />
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  onClick={(props) => {
                    handleClick();
                  }}
                >
                  {isLoading
                    ? "読み込み中です。1分程度かかります"
                    : "キャストデータを取得する"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
render(<App />, document.querySelector("#app"));
