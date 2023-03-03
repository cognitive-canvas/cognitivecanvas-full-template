let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
let params = new URLSearchParams(window.location.search);
console.log("params", params);
let seed = params.get("seed");
if (seed) {
  console.log("seed", seed);
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
  Math.random = customRandom();
}
var fxhash =
  "oo" +
  Array(49)
    .fill(0)
    .map((_) => alphabet[(Math.random() * alphabet.length) | 0])
    .join("");
var cchash = fxhash;
console.log("cchash", cchash);
let b58dec = (str) => [...str].reduce((p, c) => (p * alphabet.length + alphabet.indexOf(c)) | 0, 0);
let fxhashTrunc = fxhash.slice(2);
let regex = new RegExp(".{" + ((fxhashTrunc.length / 4) | 0) + "}", "g");
let hashes = fxhashTrunc.match(regex).map((h) => b58dec(h));
let sfc32 = (a, b, c, d) => {
  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};
var fxrand = sfc32(...hashes);
var ccrand = fxrand;

// true if preview mode active, false otherwise
var isFxpreview = params.get("preview") === "1";
var isCCpreview = isFxpreview;
var isCClive = isFxpreview;

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
