# Full Template

## Quick Start

1. Clone this repo.
2. cd to the cloned directory.
3. npx serve

The default for npx serve is to start a static server at port 5000. This is the default port Cognitive Canvas looks for
when publishing a new collection.

1. Go to Cognitive Canvas and select Publish from the header bar at the top.
2. Click the Create button from the 'Create a New Collection' card in the swiper.
3. All of the fields can be modified at any time before publishing, so supply as much as you can, but it is
   not important to have everything perfect at this time.
4. The only important field to consider is the 'slug' field. This must be globally unique and is limited to 32
   ASCII characters. We recommend using a kebab-case name with a unique domain or artist name as a part of the slug.
   For example, we use 'cognitive-' as a prefix for collections published under our brand.
5. Click the Create button to create your collection.

You will see this template card appear in the swiper.

1. Click the collection in the swiper.
2. The template UI will appear.
3. Start coding!
4. The template code is running live. If you make changes, simply click the collection in the swiper
   to get it to reload in the Cognitive Canvas iframe and pick up your changes.

## Intro

This is the Cognitive Canvas collection on OpenSea.

The Showcase demonstrates many of the features of Cognitive Canvas, and is a good template to use if you want to
display a complex UI to your users. It is written using p5js.

The Showcase is meant to run in full screen mode, and presents a nice UI for the user to configure a mint when in 'live' mode.
When not in live mode, it just displays the canvas of the currently configured mint.

When live minting, your code runs in a sandboxed iframe with many capabilities. You can also request a multitude of services
from Cognitive Canvas. Both of these combined provide a safe and flexible way to create amazing live minting experiences.

There are no restrictions on how you implement the user interface for the live minting experience. In fact,
we encourage you to use the full screen capability of the iframe to make a first class experience for your users.

You are passed a flag, <i>isCClive</i>, that tells you if you are running in the live minting enviroment, or if you should
just generate the current artwork iteration.

## Live Mode

When in live mode, there is a tight coupling between your code and the Cognitive Canvas code. All services are passed through
the 'message' events received from CC, and requested with postMessages passed to CC.

All of the CC features are wrapped in functions in the file 'cc.js', so you just call functions. The functions wrap the necessary
data and pass it to CC via postMessage.

You have to have some understanding of how Cognitive Canvas saves and restores data and parameters when the user is in live mode, as
the user is not required to do everything in one sitting. The CC environment saves the current state of all live mints, and the
user can continue with an existing live mint at any time. So there is a restore protocol that you have to understand to get the
parameters and data for a live mint that is restarted.

This is all failry easy in practice, but we are mentioning this here so you know about it when you look at the code.

## Servies, Data, and Parameters during Live Minting

Cognitive Canvas provides a very rich set of services that you can use during live minting. You are not restricted to just
modifying some simple parameters. You can add image and other files during live minting, as well as requesting any
kind of data from the user. The possibilities are really endless as there are few restrictions.

## The UI

When in live mode, a left nav is shown which contains the UI. You can put whatever you want here - this example provides
a fairly complex UI which shows how to use many of the Cognitive Canvas features.

When running inside Cognitive Canvas, you set the size of the frame you want to run in with the ccSetDimensions function. This
will set the exact size of the frame so that there are now scrollbars or other artifacts in the iframe or in the CC UI.

You can make your UI any size you want, but we recommend that you use the window.innerHeight property to determine the max
height of the frame you will run in. We always make the iframe area 100vh, so you always get the maximum viewing area for
your UI. You can get the maximum width 'screen.width' property if you need it.

### Full Screen Mode

If your UI is large (like this template), we highly recommend you add a 'Fullscreen' button and enable full screen - as in this
example. Working in full screen mode is a much better user experience when the UI is large.

## How the Template Works

This template is very flexible and reacts appropriately when in the different environments (live mode, full screen, etc), and
likely covers a very percentage of use cases, so it is a good starting point for any Live Minting experience that requires a
large UI.

### Live Mode

In live mode when in the CC iframe, the UI is positioned at the top left and the size is the exact size you indicate (via setDimension).
This is always presentable and usable.

When in full screen mode, the UI is centered on the screen for maximum usability and presentation.

## Coding Hints

The best place to look is the code itself. 'sketch.js' contains all the documention you'll need to get started.

### Messaging To/From Cognitive Canvas

All communication is done using a message loop and postMessage. The message event listener is how Cognitive Canvas
communicates with your code.

```javascript
window.addEventListener("message", (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case "save_thumbnail":
      saveThumbnail();
      break;
    case "confirm_update":
      // This is typically what you would do on confirm_update
      saveParams();
      saveAttributes();
      ccConfirmUpdate();
      break;
    case "restore":
      console.log("restoring iframe", e.data.restore);
      if (e.data.restore) {
        // restore live mint
      }
      break;
    default:
      break;
  }
});
```

### Sending Data Cognitive Canvas and Requesting Services

Look in [cc.js](./cc.js) for all the functions you can use to send data and other information back to Cognitive Canvas. All of the functions
are prefixed with 'cc'.
