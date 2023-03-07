/*
  Files that were saved during live minting all come from a 'params' directory that is added to your
  collection zip file on IPFS. IPFS has special operations that do this very efficiently (no copying), so
  each separate mint has it's own params directory.

  When your collection zip runs after a mint is configured, the 'params' directory will be accessible
  with any files that were saved for that mint, just like if you had included it in your zip file from 
  the beginning.

  When your collection is running in live mode, the 'params' directory does not exist because the user
  is configuring a mint. As you save files during configuration, we manage them internally so that
  the user can restart a live mint configuration at any time. When a user restarts a live mint, you 
  want to start with the data they have configured so far.
  
  In order to make everything seamless, the loading of files from the 'params' directory is simulated 
  during live minting. We have a special function called 'ccFetchUrlFromParams'. This returns a url 
  that you can use to retrieve 'params' files whether you are in live mint mode or in normal viewing 
  mode.

  So just use the 'ccFetchUrlFromParams' function to get the urls for any files you want get from
  the configured live mint so that your logic will be the same whether you are in live mint mode or
  just showing a configured mint in the normal way.

  Since there may be communication with the iframe parent, we do the startup in the 'load'
  event, which is recommended anyway.

*/

let paramsUrl = null;
// put your other urls here...
async function preloadParamUrls() {
  paramsUrl = await ccFetchUrlFromParams("params.json", "application/json");
}

let psk;
window.addEventListener("load", async (event) => {
  // Load the urls. After this runs we can use them anywhere.
  await preloadParamUrls();
  try {
    if (paramsUrl) {
      const res = await fetch(paramsUrl, { redirect: "follow" });
      if (res.status === 200) {
        parameters = await res.json();
      }
    }
  } catch (e) {}

  // This is the background select element
  const eleSelect = document.getElementById("background");

  // Start the sketch
  psk = new p5(function (psk) {
    /*
      This is the onchange event handler for the select background control in the UI.
    */
    eleSelect.onchange = function (event) {
      parameters.selected = event.target.selectedIndex;
      loadBackground();
      // Save the parameters in params.json
      saveParams();
    };

    psk.setup = function () {
      // setup gui if live
      setupLive();

      const { width, height } = resizeParams();
      const sketchCanvas = psk.createCanvas(width, height);
      sketchCanvas.parent("sketch");

      // ready to go
      readyLive();

      // Load current background image, start loop after it loads
      restoreParameters();
    };

    psk.draw = function () {
      // clear all
      psk.clear();
      if (backgroundImg) {
        psk.image(backgroundImg, 0, 0, psk.width, psk.height);
      }
      psk.noLoop();
    };

    psk.windowResized = function () {
      const { width, height } = resizeParams();
      if (psk.width !== width || psk.height !== height) psk.resizeCanvas(width, height);
      resizeUI();
    };

    /*
      This loads the the selected background if it is not already loaded. It has a callback, since whoever loads
      the image needs to get notified when it is ready.

      For this example, the callbacks just call loop() to enable the draw loop to redraw the selected image.
    */
    function loadBackground() {
      const idx = parameters.selected;
      backgroundImg = loaded[idx];
      if (backgroundImg !== null) {
        psk.loop();
      } else {
        const backgroundUrl = backgrounds[idx];
        psk.loadImage(backgroundUrl, (img) => {
          loaded[idx] = backgroundImg = img;
          psk.loop();
        });
      }
    }

    /*
      Updates the select control index, and loads the background from the current selection
    */
    function restoreParameters() {
      eleSelect.selectedIndex = parameters.selected;
      loadBackground();
    }
  });
});

let backgroundImg;
const backgrounds = [
  "./textured/textured-0.png",
  "./textured/textured-1.png",
  "./textured/textured-2.png",
  "./textured/textured-3.png",
  "./cityscape/cityscape-0.png",
  "./cityscape/cityscape-1.png",
  "./cityscape/cityscape-2.png",
  "./cityscape/cityscape-3.png",
  "./waterfall/waterfall-0.png",
  "./waterfall/waterfall-1.png",
  "./waterfall/waterfall-2.png",
  "./waterfall/waterfall-3.png",
];

const backgroundNames = [
  "Horizon Sunset",
  "Horizon Dusk",
  "Sandstorm",
  "Sunrise",
  "Red Cityscaoe",
  "Desert Cityscape",
  "Wired Cityscape",
  "Blue Sunrise Cityscape",
  "Waterfall from Above",
  "Waterfall from Heavens",
  "Waterfall of Light",
  "Waterfall into Glowing Pool",
];

const loaded = new Array(backgrounds.length).fill(null);

let parameters = {
  selected: 4,
};

function saveThumbnail() {
  const canvas = document.getElementById("defaultCanvas0");
  canvas.toBlob(function (blob) {
    ccSaveThumbnail(blob);
  });
}

function saveParams() {
  ccSaveParams(parameters);
}

/*
  The attributes are in the OpenSea format, see https://docs.opensea.io/docs/metadata-standards#section-attributes
*/
const saveAttributes = () => {
  const attrs = [
    {
      trait_type: "Background",
      value: backgroundNames[parameters.selected],
    },
  ];
  ccSaveAttributes(attrs);
};

function showParams() {
  console.log("parameters", parameters);
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

/*
  This is the handler for the Full Screen button.
*/
function fullscreenClicked(event) {
  document.documentElement.requestFullscreen();
}

function isFullscreen() {
  return !!document.fullscreenElement;
}

/*
  This changes the body flex container to center everything if the window is large enough in
  full screen mode, or if not in live mode.

  If in live mode, it sets the iframe size to my liking
*/
function resizeUI() {
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
  setSize(wwidth, wheight);
}

function setSize(wwidth, wheight) {
  if (isCClive) ccSetSize(wwidth, wheight);
}

/*
  Enable user thumbnail generation and enable the prepare button. For this simple example, we can enable these buttons
  in setup. For other more complicated examples, you can use your own logic to determine to when enable the buttons.
*/
function readyLive() {
  if (isCClive) {
    ccEnableThumbnail();
    ccEnablePrepare();
  }
}

let maxw = 0;
let maxh = 0;
let wwidth = 0;
let wheight = 0;
function resizeParams() {
  /*
    When running in live mint mode, the innerHeight will always be the real window.innerHeight (that's the size we make
    the iframe), so this is the same in all cases. The innerWidth will be at least 900 in live mint mode, but you can make 
    this larger since you can set the size that you want via ccSetSize.

    In other words, window.innerHeight is the same in all modes, and window.innerWidth can be managed by you in live mint mode.

    In this case, we are just using the window.innerHeight to make our canvas between 700px and 900px square. Then we just 
    add 500 for the width of the ui in the left nav if in live mint mode.
  */
  maxh = window.innerHeight;
  maxw = window.innerWidth;
  let dim = maxh;
  dim = Math.min(900, dim); // 900 max
  dim = Math.max(dim, 700); // 700 min
  wwidth = isCClive ? dim + 500 : dim;
  wheight = dim;
  return { width: dim, height: dim };
}

/*
  Listen for messages from Cognitive Canvas when in live mint mode. 

  "save_thumbnail" - sent when the user clicks the save thumbnail button. 
  "confirm_update" - sent when the user clicks the prepare update button. Do any final actions here.

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
    default:
      break;
  }
});
