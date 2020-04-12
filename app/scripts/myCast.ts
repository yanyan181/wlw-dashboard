import { mycast, castDetail, CastData } from "./util";
import { createCastData } from "./createCastData";

let isLoading = false;

if (localStorage.castDataList) insertDOM(document);

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "UPDATE_CASTDATA") {
    await createCastList(document);
    await chrome.runtime.sendMessage({ message: "STORED_CASTDATA" });
    await location.reload();
  }
  if (request.message === "GET_LOADING_STATE") {
    await chrome.runtime.sendMessage({
      message: isLoading ? "LOADING_NG" : "LOADING_OK",
    });
  }
  if (request.message === "GET_LAST_DATE") {
    await chrome.runtime.sendMessage({
      message: "SEND_LAST_DATE",
      date: localStorage.lastGetDate,
    });
  }
});

export async function createCastList(doc: Document) {
  const castList: any = await mycast();
  const castDataList: CastData[] = [];
  isLoading = true;
  if (castList.status === "OK") {
    for (const cast of castList.cast) {
      const castDom: Document = await castDetail(cast.id);
      castDataList.push(
        await createCastData(
          castDom,
          cast.id,
          cast.na,
          cast.crc >= 4 ? String(+cast.cr + 100) : String(+cast.cr),
          cast.ci,
          cast.rt
        )
      );
      const sleep = (msec: number) =>
        new Promise((resolve) => setTimeout(resolve, msec));
      await sleep(1000);
    }
  }
  isLoading = false;
  localStorage.castDataList = JSON.stringify(castDataList);
  const dateTime = new Date();
  localStorage.lastGetDate = dateTime.toLocaleDateString();
}

export function insertDOM(doc: Document) {
  const innerDom = document.getElementById("inner");
  if (innerDom?.parentNode) {
    const script = document.createElement("script");
    script.src = "../pages/mycast.js";
    innerDom.parentNode.insertBefore(script, innerDom.nextSibling);
    const subHeader = document.createElement("h2");
    subHeader.id = "page_title";
    subHeader.innerText = "戦績";
    innerDom.parentNode.insertBefore(subHeader, innerDom);
    const div = document.createElement("div");
    div.id = "app";
    innerDom.parentNode.insertBefore(div, innerDom);
  }
}
