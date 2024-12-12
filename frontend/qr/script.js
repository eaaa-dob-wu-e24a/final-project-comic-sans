function getCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("join");
}

const code = getCode();
console.log(code);

const baseURL = "https://final-project-comic-sans-fork.vercel.app/";
const apiURL = "https://eventually-api.nikolajhoeegjensen.com/api";

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
  data: "https://final-project-comic-sans-fork.vercel.app/join/" + code,
  dotsOptions: {
    color: "hsl(244 38% 30%)",
    type: "square",
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

async function getEventInfo(joincode) {
  try {
    const response = await fetch(apiURL + "/event/code/?joincode=" + joincode);
    const data = await response.json();
    codeElement.innerText = data["JoinCode"];
    title.innerText = data["Title"];
    loc.innerText = data["Location"];

    if (data["FinalDate"] && data["FinalDate"].length > 1) {
      time.innerText = data["FinalDate"];
    } else {
      time.innerText = "Awaiting votes for final date...";
    }

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getEventInfo(code);

async function copyText() {
  try {
    await navigator.clipboard.writeText(code);
    const icon = document.getElementById("copyicon");
    icon.src = "assets/check.svg";
    console.log('copied "' + code + '" to clipboard');
  } catch (error) {
    console.error("failed to copy text: " + error);
  }
}
