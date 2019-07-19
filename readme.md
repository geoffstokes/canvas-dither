# Canvas Dither

## Description
Simple demo of image processing in Javascript using HTML5 and Canvas.

## Recent Changes
- Includes a timer for performance testing
- Now able to dither/process each channel (R, G and B) separately, producing interesting effects
- Now allows for choosing your own image to process
- Moved processing to a Web Worker
- Now able to output images in three different formats! (Assuming your browser supports it)
- Renders to an `<img>` element rather than just to a canvas
- Can filter pixels using a simple threshold as well as Atkinson dithering (which, obviously, is what you're here for)

## Future Plans
- Create fallback for when web workers are not available
- Enable drag-and-drop custom image selection
- Improve compatibility
- Probably going to re-style to look more like classic Mac OS (currently borrows a lot of design language and ideas from OS X, like [fractal-thing](https://github.com/geoffstokes/fractal-thing).)

## Version History
### v1.0
- Full implementation of algorithm in main JS thread
- Renders to an `<img>` element

### v2.0
- Moved to Web Workers

### v3.0
- Allowed custom image uploads
- Deal more effectively with large/broken/invalid images

### v3.1
- Enabled processing each channel separately, all required channels are processed in one pass
- Tidied up some stuff, made JS create its canvas itself and render off screen
- Added timers for performance testing

### v4.0
- Render on every change
- Added BMP output format
- Added shortcut keys (numbers=dithering, alt+numbers=grayscale, letters=some other controls)
- Added datalist for each range slider
- Hide sliders when not relevant
- Fire setup only when DOM ready
- Added Decomposition grayscale
- Added Desaturation grayscale
- Added Desaturation grayscale
- Added Shades grayscale
- Added Single Channel grayscale
- Added Disable dithering
- Added Burkes dithering
- Added False Floyd-Steinberg dithering
- Added Floyd-Steinberg dithering
- Added Jarvis-Judice-Ninke dithering
- Added Sierra dithering
- Added Sierra 2-row dithering
- Added Sierra Lite dithering
- Added Stucki dithering
- Change spelling of greyscale to grayscale
- Added output image scaling

## To Do
- Add Brightness
- Add Contrast
- Add Sharpen
- Add Saturation
- Add Lightness
- Add Bayer dithering
- Add Save/Load serialised prefs to/from cookie/file
- Fix legacy console.time warnings
- Use Uint8ClampedArray for faster drawing

## Notes
Takes a lot of learned stuff from my [fractal-thing](https://github.com/ticky/fractal-thing) project (and improves on it significantly).

Example image is by Keven Law, and [sourced from flickr](http://www.flickr.com/photos/kevenlaw/2308263346/). Image is licensed under Creative Commons Attribution-ShareAlike 2.0 Generic.

Grayscale methods from [Tanner Helland PhotoDemon blog](http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/)

Dithering methods from [Tanner Helland PhotoDemon blog](http://www.tannerhelland.com/4660/dithering-eleven-algorithms-source-code/)

## Contributors
- [@ticky](https://github.com/ticky)
- [@gingerbeardman](https://github.com/gingerbeardman)
