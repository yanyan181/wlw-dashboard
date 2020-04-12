import { CastData } from "./util";

const id: number = +location.search.substring(1).split("&")[0].slice(5) || 0;
if (localStorage.castDataList) {
  const castDataList: CastData[] = JSON.parse(localStorage.castDataList);
  castDataList.forEach((castData) => {
    if (castData.id === id) {
      insertDivs("敗北数", castData.loseCount + "敗");
      insertDivs("勝率", castData.winRate + "％");
      insertDivs("kill Rate", `${castData.killRate}`);
    }
  });
}

function insertDivs(title: string, text: string): void {
  const pDom = document.getElementsByClassName("frame_inner");
  const parents = document.createElement("div");
  parents.className = "block_playdata_01 clearfix";
  const childTitle = document.createElement("div");
  childTitle.className = "block_playdata_01_title";
  childTitle.textContent = title;
  const childText = document.createElement("div");
  childText.className = "block_playdata_01_text";
  childText.textContent = text;
  parents.appendChild(childTitle);
  parents.appendChild(childText);
  pDom[0].appendChild(parents);
}
