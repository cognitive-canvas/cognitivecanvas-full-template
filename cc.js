let params = new URLSearchParams(window.location.search);
console.log("params", params);
let seed = params.get("seed");
console.log("q seed", seed);
if (!seed) seed = Math.floor(Math.random() * 1000000000).toString();
console.log("seed", seed);

function ccCreateRand(seed) {
  let mod = BigInt(4294967295);
  let bigInt = BigInt(seed);
  let randomNumber = Number(bigInt % mod);
  function customRandom() {
    let x = randomNumber;
    return function () {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  }
  return customRandom();
}
var ccrand = ccCreateRand(seed);

// true if live mode
var isCClive = params.get("preview") === "1" || params.get("live") === "1";

// functions to interact with the mint configuration

// Save the thumbnail
function ccSetSize(width, height) {
  try {
    window.top.postMessage(
      {
        type: "set_size",
        width,
        height,
      },
      "*"
    );
  } catch (e) {}
}

function ccSaveThumbnail(blob) {
  try {
    window.top.postMessage(
      {
        type: "save_thumbnail",
        blob,
      },
      "*"
    );
  } catch (e) {}
}

// Save the params.json object
function ccSaveParams(params) {
  try {
    window.top.postMessage(
      {
        type: "save_params",
        params,
      },
      "*"
    );
  } catch (e) {}
}

// Save the attributes (features in fxhash parlance).
function ccSaveAttributes(attrs) {
  try {
    window.top.postMessage(
      {
        type: "save_attributes",
        attrs,
      },
      "*"
    );
  } catch (e) {}
}

// Enable the thumbnail button in Cognitive Canvas
function ccEnableThumbnail() {
  try {
    window.top.postMessage(
      {
        type: "enable_thumbnail",
      },
      "*"
    );
  } catch (e) {}
}

// Enable the prepare button in Cognitive Canvas
function ccEnablePrepare() {
  try {
    window.top.postMessage(
      {
        type: "enable_prepare",
      },
      "*"
    );
  } catch (e) {}
}

// Confirm that an update is ready.
function ccConfirmUpdate() {
  try {
    window.top.postMessage(
      {
        type: "confirm_update",
      },
      "*"
    );
  } catch (e) {}
}

// Send when you are ready to receive messages from Cognitive Canvas.
function ccReady(restore) {
  try {
    window.top.postMessage(
      {
        type: "ready",
        restore,
      },
      "*"
    );
  } catch (e) {}
}
//---- /do not edit the following code

// Save a text file
function ccSaveTextFile(text, path, fname) {
  try {
    window.top.postMessage(
      {
        type: "save_text_file",
        text,
        path,
        fname,
      },
      "*"
    );
  } catch (e) {}
}

// Save a binary file from a blob
function ccSaveBinaryFileFromBlob(blob, path, fname) {
  try {
    window.top.postMessage(
      {
        type: "save_binary_file_from_blob",
        blob,
        path,
        fname,
      },
      "*"
    );
  } catch (e) {}
}

// Save a binary file from a Uint8Array
function ccSaveBinaryFileFromUIint8(uint8, path, fname) {
  try {
    window.top.postMessage(
      {
        type: "save_binary_file_from_uint8",
        uint8,
        path,
        fname,
      },
      "*"
    );
  } catch (e) {}
}

// Get an image that is saved in the param directory
function ccLoadImage(fname, cb) {
  if (isCClive) {
    try {
      window.top.postMessage(
        {
          type: "loadImage",
          fname,
        },
        "*"
      );
    } catch (e) {}
  } else {
    loadImage(fname, cb);
  }
}

async function ccFetchBlobFromParams(fname, mime) {
  const message = { type: "load_params_file_as_blob", fname, mime };
  const promise = new Promise((resolve) => {
    function listener(event) {
      if (event.data.type === "loaded_params_file_as_blob") {
        window.removeEventListener("message", listener);
        resolve(event.data.blob);
      }
    }
    window.addEventListener("message", listener);
  });
  window.top.postMessage(message, "*");
  return promise;
}

async function ccFetchUrlFromParams(fname, mime) {
  if (isCClive) {
    const blob = await ccFetchBlobFromParams(fname, mime);
    return URL.createObjectURL(blob);
  } else {
    return `./params/${fname}`;
  }
}
