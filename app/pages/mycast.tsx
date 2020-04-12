import * as React from "react";
import { render } from "react-dom";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  TableSortLabel,
  Grid,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  Typography,
  IconButton,
} from "@material-ui/core";

import { CastData } from "../scripts/util";

import { makeStyles, withStyles } from "@material-ui/core/styles";

import { PieChart, Pie, Sector, Cell, PieLabelRenderProps } from "recharts";

interface Column {
  id: string;
  label: string;
  minWidth: number;
  format: Function;
}

const columns: Column[] = [
  {
    id: "image",
    label: "",
    minWidth: 30,
    format: (value: string) => {
      return "common/img_cast/" + value;
    },
  },
  {
    id: "name",
    label: "キャスト名",
    minWidth: 30,
    format: (value: string) => {
      return value;
    },
  },
  {
    id: "rank",
    label: "CR",
    minWidth: 30,
    format: (value: number) => {
      return value >= 100 ? "EX" + String(value - 100) : value;
    },
  },
  {
    id: "useRate",
    label: "使用率",
    minWidth: 30,
    format: (value: number) => {
      return String(value) + "％";
    },
  },
  {
    id: "winCount",
    label: "勝利数",
    minWidth: 30,
    format: (value: any) => {
      return value;
    },
  },
  {
    id: "loseCount",
    label: "敗北数",
    minWidth: 30,
    format: (value: any) => {
      return value;
    },
  },
  {
    id: "winRate",
    label: "勝率",
    minWidth: 30,
    format: (value: number) => {
      return String(value) + "％";
    },
  },
  {
    id: "killRate",
    label: "キルレシオ",
    minWidth: 30,
    format: (value: any) => {
      return value;
    },
  },
];

const GreenCheckbox = withStyles({
  root: {
    color: "green",
    "&$checked": {
      color: "green",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 600,
    marginBottom: "50px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  paper: {
    textAlign: "center",
  },
  boardGrid: {
    minHeight: "312px",
  },
  boardMargin: {
    marginTop: "20px",
  },
});

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: any) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.id}
            style={{ minWidth: column.minWidth }}
            sortDirection={orderBy === column.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : "asc"}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
            </TableSortLabel>
            {orderBy === column.id ? (
              <span className={classes.visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </span>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
type Order = "asc" | "desc";

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof CastData
  ) => void;
  order: Order;
  orderBy: keyof CastData;
  rowCount: number;
}

interface EnhancedTableBodyProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof CastData
  ) => void;
  order: Order;
  orderBy: keyof CastData;
  rows: CastData[];
}

function EnhancedTable(props: EnhancedTableBodyProps) {
  const { classes, order, orderBy, onRequestSort, rows } = props;
  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={onRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map(
              (castData: any) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={castData.name}
                  >
                    {columns.map((column) => {
                      const value = castData[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === "image" ? (
                            <IconButton
                              onClick={() => {
                                location.href =
                                  "https://wonderland-wars.net/castdetail.html?cast=" +
                                  castData.id;
                              }}
                            >
                              <Avatar
                                alt={castData.name}
                                src={column.format(value)}
                              />
                            </IconButton>
                          ) : (
                            column.format(value)
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

interface RollFilter {
  fFlag: boolean;
  aFlag: boolean;
  sFlag: boolean;
}
interface CRFilter {
  lowFlag: boolean;
  midFlag: boolean;
  highFlag: boolean;
  exFlag: boolean;
}

interface UserData {
  gameCount: number;
  winCount: number;
  loseCount: number;
  winRate: number;
  killRate: number;
  useCastCount: number;
}

function createUserData(list: CastData[]): UserData {
  let totalWinCount = 0;
  list.forEach((castData) => {
    totalWinCount += castData.winCount;
  });
  let totalLoseCount = 0;
  list.forEach((castData) => {
    totalLoseCount += castData.loseCount;
  });
  const totalGameCount = totalWinCount + totalLoseCount;
  const totalWinRate = totalGameCount != 0 ? totalWinCount / totalGameCount : 0;
  let killRate = 0;
  let useCastCount = 0;
  let crZeroCount = 0;
  list.forEach((castData) => {
    if (castData.rank > 0) {
      killRate += castData.killRate;
      useCastCount += 1;
    } else {
      crZeroCount += 1;
    }
  });
  killRate = useCastCount != 0 ? killRate / useCastCount : 0;

  return {
    gameCount: totalGameCount,
    winCount: totalWinCount,
    loseCount: totalLoseCount,
    winRate: totalWinRate,
    killRate: killRate,
    useCastCount: useCastCount + crZeroCount,
  };
}

function filterRoll(
  rollFilter: RollFilter,
  crFilter: CRFilter,
  list: CastData[]
): CastData[] {
  const rows: CastData[] = list.filter((item: CastData) => {
    switch (item.roll) {
      case 0:
        return rollFilter.fFlag;
      case 1:
        return rollFilter.aFlag;
      case 2:
        return rollFilter.sFlag;
      default:
        return true;
    }
  });
  const newRows: CastData[] = rows.filter((item: CastData) => {
    if (item.rank < 10) {
      return crFilter.lowFlag;
    } else if (item.rank < 20) {
      return crFilter.midFlag;
    } else if (item.rank < 30) {
      return crFilter.highFlag;
    } else if (item.rank >= 100) {
      return crFilter.exFlag;
    } else {
      return true;
    }
  });
  return newRows;
}
interface UserDataBoradProps {
  castDataList: CastData[];
  userData: UserData;
}

function UserDataBoard(props: UserDataBoradProps) {
  const { userData, castDataList } = props;
  const classes = useStyles();
  return (
    <Grid item xs={6}>
      <Paper className={classes.boardGrid}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5">wlwダッシュボードv1.0</Typography>
            <Typography variant="caption">
              wlwの戦績を詳細に見るための非公式ツールです。
              <br />
              非公式のため使用に関しては自己責任でお願いします。
              <br />
              バグなどの報告は
              <a href="https://twitter.com/aRpuN85Qb8zX0HU">こちら</a>まで
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.boardMargin}>
          <Grid item xs={12}>
            対戦数：{userData.gameCount}
          </Grid>
          <Grid item xs={12}>
            勝利数：{userData.winCount}
          </Grid>
          <Grid item xs={12}>
            敗北数：{userData.loseCount}
          </Grid>
          <Grid item xs={12}>
            勝率：{userData.winRate !== 0 ? userData.winRate.toFixed(2) : 0}％
          </Grid>
          <Grid item xs={12}>
            キルレシオ：
            {userData.killRate !== 0 ? userData.killRate.toFixed(2) : 0}
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

interface PieChartsProps {
  castDataList: CastData[];
}

function renderActiveShape(props: any) {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  return (
    <g>
      <text x={cx} y={cy} dy={0} textAnchor="middle" fill="#000000">
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={20}
        fontSize={11}
        textAnchor="middle"
        fill="#000000"
      >
        {`使用率： ${(percent * 100).toFixed(2)}%`}
      </text>
      <text
        x={cx}
        y={cy}
        dy={32}
        fontSize={11}
        textAnchor="middle"
        fill="#000000"
      >
        {`勝率： ${(100 * payload.winRate).toFixed(2)}%`}
      </text>
      <text
        x={cx}
        y={cy}
        dy={44}
        fontSize={11}
        textAnchor="middle"
        fill="#000000"
      >
        {`キルレシオ： ${payload.killRate.toFixed(2)}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
}

function PieCharts(props: PieChartsProps) {
  const { castDataList } = props;
  const fList: CastData[] = [];
  castDataList.forEach((castData) => {
    if (castData.roll === 0) fList.push(castData);
  });
  const fUserData = createUserData(fList);
  const aList: CastData[] = [];
  castDataList.forEach((castData) => {
    if (castData.roll === 1) aList.push(castData);
  });
  const aUserData = createUserData(aList);
  const sList: CastData[] = [];
  castDataList.forEach((castData) => {
    if (castData.roll === 2) sList.push(castData);
  });
  const sUserData = createUserData(sList);
  const rollData = [
    { roll: 0, name: "ファイター", ...fUserData },
    { roll: 1, name: "アタッカー", ...aUserData },
    { roll: 2, name: "サポーター", ...sUserData },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  return (
    <Grid item xs={6}>
      <Paper>
        <Typography variant="h5">使用率</Typography>
        <PieChart width={320} height={280}>
          <Pie
            dataKey="gameCount"
            nameKey="name"
            data={rollData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={70}
            startAngle={-270}
            endAngle={-630}
            label={false}
            isAnimationActive={true}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(props, index) => {
              setActiveIndex(index);
            }}
          >
            {rollData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Paper>
    </Grid>
  );
}

const App: React.FC = () => {
  const classes = useStyles();
  const castDataStr: string = localStorage.castDataList;
  const [userData, setUserData] = React.useState<UserData>(
    createUserData(JSON.parse(castDataStr))
  );
  const [rows, setRows] = React.useState<CastData[]>(JSON.parse(castDataStr));

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof CastData>("name");

  const [fFlag, setFFlag] = React.useState<boolean>(true);
  const [aFlag, setAFlag] = React.useState<boolean>(true);
  const [sFlag, setSFlag] = React.useState<boolean>(true);

  const [lowFlag, setLowFlag] = React.useState<boolean>(true);
  const [midFlag, setMidFlag] = React.useState<boolean>(true);
  const [highFlag, setHighFlag] = React.useState<boolean>(true);
  const [exFlag, setExFlag] = React.useState<boolean>(true);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof CastData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  React.useEffect(() => {
    const filterRows = filterRoll(
      { fFlag, aFlag, sFlag },
      { lowFlag, midFlag, highFlag, exFlag },
      JSON.parse(castDataStr)
    );
    setRows(filterRows);
    setUserData(createUserData(filterRows));
  }, [fFlag, aFlag, sFlag, lowFlag, midFlag, highFlag, exFlag]);

  return (
    <div>
      <Grid container>
        <UserDataBoard
          castDataList={JSON.parse(castDataStr)}
          userData={userData}
        />
        <PieCharts castDataList={JSON.parse(castDataStr)} />
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={fFlag}
                      onClick={() => {
                        setFFlag(fFlag ? false : true);
                      }}
                    />
                  }
                  label="ファイター"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={aFlag}
                      onClick={() => {
                        setAFlag(aFlag ? false : true);
                      }}
                    />
                  }
                  label="アタッカー"
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={sFlag}
                      onClick={() => {
                        setSFlag(sFlag ? false : true);
                      }}
                    />
                  }
                  label="サポーター"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={lowFlag}
                      onClick={() => {
                        setLowFlag(lowFlag ? false : true);
                      }}
                    />
                  }
                  label="CR0～CR9"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={midFlag}
                      onClick={() => {
                        setMidFlag(midFlag ? false : true);
                      }}
                    />
                  }
                  label="CR10～CR19"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={highFlag}
                      onClick={() => {
                        setHighFlag(highFlag ? false : true);
                      }}
                    />
                  }
                  label="CR20～CR29"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      name="checkedG"
                      checked={exFlag}
                      onClick={() => {
                        setExFlag(exFlag ? false : true);
                      }}
                    />
                  }
                  label="EX0～"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item>
          <EnhancedTable
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rows={rows}
          />
        </Grid>
      </Grid>
    </div>
  );
};
render(<App />, document.querySelector("#app"));
