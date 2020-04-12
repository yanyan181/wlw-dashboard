export interface CastData {
  id: number;
  name: string;
  rank: number;
  image: string;
  useRate: number;
  winCount: number;
  killCount: number;
  deathCount: number;
  averageEval: number;
  winEval: number;
  loseEval: number;
  averageNice: number;
  winNice: number;
  loseNice: number;
  loseCount: number;
  winRate: number;
  killRate: number;
  roll: number;
  timestamp: number;
}

const MYCAST_ENDPOINT = "https://wonderland-wars.net/mycast";
const CASTDETAIL_ENDPOINT = "https://wonderland-wars.net/castdetail.html?cast=";

export async function mycast(): Promise<any> {
  return await fetch(MYCAST_ENDPOINT, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then((payload: any) => {
      return payload;
    })
    .catch((error: Error) => {
      return error;
    });
}

export async function castDetail(castId: string): Promise<any> {
  return await fetch(CASTDETAIL_ENDPOINT + castId, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.text();
      }
      throw res;
    })
    .then((htmlStr: string) => {
      return new DOMParser().parseFromString(htmlStr, "text/html");
    })
    .catch((error: Error) => {
      return error;
    });
}
