# Full Template

## Quick Start

1. Clone this repo.
2. cd to the cloned directory.
3. npx serve

The default for npx serve is to start a static server at port 5000. This is the default port Cognitive Canvas looks for
when publishing a new collection.

1. Go to [Cognitive Canvas](https://cognitivecanvas.xyz/public/publish).
2. Click the **Create** button from the **Create a New Collection** card in the swiper.
3. All of the fields can be modified at any time before publishing, so supply as much as you can, but it is
   not important to have everything perfect at this time.
4. The only important field to consider is the **slug** field. This must be globally unique and is limited to 32
   ASCII characters. We recommend using a kebab-case name with a unique domain or artist name as a part of the slug.
   For example, we use _cognitive-_ as a prefix for collections published under our brand.
5. Click the **Create** button to create your collection.

You will see the template card appear in the swiper.

1. Click the collection in the swiper to load it.
2. The template UI will appear.
3. Start coding!
4. The template code is running live. If you make changes, simply click the collection in the swiper
   to get it to reload in the Cognitive Canvas iframe and pick up your changes.

## Intro

This is a Cognitive Canvas template to get you started. It is a very good starting point for most projects, as
it can easily be adopted to many use cases. The template uses p5.js.

Be sure to read [Publishing](https://cognitivecanvas.xyz/public/doc/publishing) which contains details of how
to collections work.

Also, read the comments in [sketch.js](./blob/main/sketch.js), and [cc.js](./blob/main/cc.js) contains our library that contains
the functions you need to get services from CC during live minting.
