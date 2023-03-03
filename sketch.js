let backgroundImg;
const backgrounds = ["dark.png", "light.png"];

/*
  Get the params.json file for this mint. If the file is not present, it means that the user is configuring a mint.
  You should get any other external files that were configured with this mint here also. They will always be relative to
  the params directory.
*/
async function preload() {
  try {
    console.log("preload, loading");
    const res = await fetch("./params/params.json", { redirect: "follow" });
    if (res.status === 200) {
      const params = await res.json();
      console.log("preload params", params);
      restoreParams(params);
    }
  } catch (e) {
    console.log("preload params failed", e);
  }
}

function saveThumbnail() {
  const canvas = document.getElementById("defaultCanvas0");
  canvas.toBlob(function (blob) {
    ccSaveThumbnail(blob);
  });
}

function getParams() {
  return {};
}

function saveParams() {
  const params = getParams();
  ccSaveParams(params);
}

function saveAttributes() {
  const params = getParams();
  ccSaveAttributes(params);
}

function showParams() {}

function restoreParams(params) {}

function windowResized() {
  const { width, height } = resizeParams();
  resizeCanvas(width, height);
  resizeUI();
}

/*
  If isCClive is set, then this is a live mint. Show the configuration GUI. 
*/
function setupLive() {
  if (isCClive) {
    document.getElementById("ui").style.display = "flex";
  }
  resizeUI();
}

function fullscreenClicked(event) {
  document.documentElement.requestFullscreen();
}

function isFullscreen() {
  return !!document.fullscreenElement;
}

function resizeUI() {
  // This just changes the container so that it centers if the window is large enough
  resizeParams();
  let align = "start";
  let justify = "flex-start";
  if (isCClive) {
    if (isFullscreen()) {
      align = maxh <= wheight ? "start" : "center";
      justify = wwidth <= maxw ? "center" : "flex-start";
    }
  } else {
    align = maxh <= wheight ? "start" : "center";
    justify = wwidth <= maxw ? "center" : "flex-start";
  }
  document.body.style.justifyContent = justify;
  document.body.style.alignItems = align;
  ccSetSize(wwidth, wheight);
}

/*
  If isCClive is set, send the ready events to CC. 
*/
function readyLive() {
  if (isCClive) {
    /*
      Enable user thumbnail generation and enable the prepare button. For this simple example, we can enable these buttons
      in setup. For other more complicated examples, you can use your own logic to enable the buttons.
    */
    ccEnableThumbnail();
    ccEnablePrepare();

    /*
      Signal ready and ask for any configuration data that needs to be restored. For this sample,
      only the params are needed. This array will include all data that is to be restored. The 
      restored data will be retured in the "restore" event, see above.
    */
    ccReady({
      params: { type: "restore_params" },
    });
  }
}

/*
  canvas is 900x900 if ui is showing, otherwise the largest square that will fit in the window
*/
let maxw = 0;
let maxh = 0;
let wwidth = 0;
let wheight = 0;
function resizeParams() {
  maxh = window.innerHeight;
  maxw = window.innerWidth;
  let dim = maxh;
  dim = Math.min(900, dim); // 900 max
  dim = Math.max(dim, 700); // 700 min
  wwidth = isCClive ? dim + 500 : dim;
  wheight = dim;
  return { width: dim, height: dim };
}

function selectBackground(event) {
  console.log("background", event);
  const idx = event.target.selectedIndex;
  const backgroundUrl = `images/${backgrounds[idx]}`;
  loadImage(backgroundUrl, (img) => {
    backgroundImg = img;
    loop();
  });
}

function setup() {
  // setup gui if live
  setupLive();

  const { width, height } = resizeParams();
  const sketchCanvas = createCanvas(width, height);
  sketchCanvas.parent("sketch");

  // ready to go
  readyLive();

  // Don't loop automatically
  noLoop();
}

function draw() {
  // clear all
  clear();
  background(0, 0, 255);

  noLoop();
}

/*
  Listen for messages from Cognitive Canvas when in preview mode. 

  "save_thumbnail" - sent when the user clicks the save thumbnail button. 
  "confirm_update" - sent when the user clicks the prepare update button. Do any final actions here.
  "restore" - restore data when the user is configuring a saved mint. See also ccReady.

*/
window.addEventListener("message", (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case "save_thumbnail":
      saveThumbnail();
      break;
    case "confirm_update":
      saveParams();
      saveAttributes();
      ccConfirmUpdate();
      break;
    case "restore":
      console.log("restoring params iframe", e.data.restore);
      if (e.data.restore.params.restored) restoreParams(e.data.restore.params.restored);
      loop(); // make sure we draw again
      break;
    default:
      break;
  }
});
