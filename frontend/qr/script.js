function getCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("join");
}

const code = getCode();
console.log(code);

const baseURL = "http://localhost:3000/";
const apiURL = "http://localhost:4000/api";

const title = document.getElementById("title");
const time = document.getElementById("time");
const loc = document.getElementById("location");
const codeElement = document.getElementById("joincode");
const toEventButton = document.getElementById("toevent");

let toURL = baseURL + "join/" + code;
toEventButton.addEventListener("click", () => {
  window.location.href = toURL;
});

const qrCode = new QRCodeStyling({
  width: 280,
  height: 280,
  type: "svg",
  data: "http://localhost:3000/join/",
  dotsOptions: {
    color: "hsl(244 38% 30%)",
    type: "dots",
  },
  backgroundOptions: {
    color: "transparent",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
});

qrCode.append(document.getElementById("canvas"));

async function getEventInfo(id) {
  try {
    const response = await fetch(apiURL + "/event/id/" + id);
    const data = await response.json();
    codeElement.innerText = data["JoinCode"];
    title.innerText = data["Title"];
    loc.innerText = data["Location"];
    time.innerText = data["FinalDate"];
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getEventInfo(55);
