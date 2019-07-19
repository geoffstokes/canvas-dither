function draw (data) {

	if (data.processing.grayscaleMethod == "luminance") {

		grayscale_luminance(data.image.data);

	} else if (data.processing.grayscaleMethod == "decomposition") {

		grayscale_decomposition(data.image.data);

	} else if (data.processing.grayscaleMethod == "desaturation") {

		grayscale_desaturation(data.image.data);

	} else if (data.processing.grayscaleMethod == "shades") {

		grayscale_shades(data.image.data, data.processing.grayscaleShades);

	} else if (data.processing.grayscaleMethod == "singlechannel") {

		grayscale_singlechannel(data.image.data, data.processing.grayscaleChannel);

	} else if (data.processing.grayscaleMethod == "average") {

		grayscale_average(data.image.data);

	}

	if (data.processing.ditherMethod == "atkinson") {

		dither_atkinson(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "burkes") {

		dither_burkes(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "falsefloydsteinberg") {

		dither_falsefloydsteinberg(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "floydsteinberg") {

		dither_floydsteinberg(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "jarvisjudiceninke") {

		dither_jarvisjudiceninke(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "sierra") {

		dither_sierra(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "sierratworow") {

		dither_sierratworow(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "sierralite") {

		dither_sierralite(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "stucki") {

		dither_stucki(data.image.data, data.image.width, (data.processing.grayscaleMethod == ""));

	} else if (data.processing.ditherMethod == "threshold") {

		dither_threshold(data.image.data, data.processing.ditherThreshold);
	}

	if (data.processing.replaceColours == true) {

		replace_colours(data.image.data, data.processing.replaceColourMap.black, data.processing.replaceColourMap.white);

	}

	return data;
}

// Convert image data to grayscale based on luminance.
function grayscale_luminance (image) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i] * 0.2126 + image.data[i + 1] * 0.7152 + image.data[i + 2] * 0.0722, 10);	// BT.709
		// image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i] * 0.299 + image.data[i + 1] * 0.587 + image.data[i + 2] * 0.114, 10);	// BT.601
		// image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i] * 0.3 + image.data[i + 1] * 0.59 + image.data[i + 2] * 0.11, 10);	// Photoshop

	}

	return image;
}

// Convert image data to grayscale based on average of R, G and B values.
function grayscale_average (image) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3, 10);

	}

	return image;
}

// Convert image data to grayscale based on max/min decomposition of R, G and B values.
function grayscale_decomposition (image) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(Math.max(image.data[i], image.data[i + 1], image.data[i + 2]), 10); // maximum decomposition
		// image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(Math.min(image.data[i], image.data[i + 1], image.data[i + 2]), 10); // minimum decomposition

	}

	return image;
}

// Convert image data to grayscale based on desaturation of R, G and B values.
function grayscale_desaturation (image) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(Math.max(image.data[i], image.data[i + 1], image.data[i + 2]) + Math.min(image.data[i], image.data[i + 1], image.data[i + 2]) / 2, 10);

	}

	return image;
}

// Convert image data to grayscale based on a single channel of R, G or B values.
function grayscale_singlechannel (image, channel) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt(image.data[i + parseInt(channel)], 10);

	}

	return image;
}

// Convert image data to grayscale based on custom number of shades.
function grayscale_shades (image, shades) {

	var factor = 255 / (shades - 1);

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i] = image.data[i + 1] = image.data[i + 2] = parseInt( ((((image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3) / factor) + 0.5) * factor, 10);

	}

	return image;
}

// Apply Atkinson Dither to Image Data
function dither_atkinson (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 8;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 1;
		image.data[currentPixel + 8]						+= err * 1;

		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 1;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 1;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 1;

		image.data[currentPixel + (8 * imageWidth)]			+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply False Floyd-Steinberg Dither to Image Data
function dither_falsefloydsteinberg (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 8;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 3;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 3;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 2;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Floyd-Steinberg Dither to Image Data
function dither_floydsteinberg (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 16;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 7;

		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 3;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 5;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Jarvis, Judice, and Ninke Dither to Image Data
function dither_jarvisjudiceninke (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 48;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 7;
		image.data[currentPixel + 8]						+= err * 5;

		image.data[currentPixel + (4 * imageWidth) - 8]		+= err * 3;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 5;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 7;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 5;
		image.data[currentPixel + (4 * imageWidth) + 8]		+= err * 3;

		image.data[currentPixel + (8 * imageWidth) - 8]		+= err * 1;
		image.data[currentPixel + (8 * imageWidth) - 4]		+= err * 3;
		image.data[currentPixel + (8 * imageWidth)]			+= err * 5;
		image.data[currentPixel + (8 * imageWidth) + 4]		+= err * 3;
		image.data[currentPixel + (8 * imageWidth) + 8]		+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Sierra Dither to Image Data
function dither_sierra (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 32;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 5;
		image.data[currentPixel + 8]						+= err * 3;

		image.data[currentPixel + (4 * imageWidth) - 8]		+= err * 2;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 5;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth) + 8]		+= err * 2;

		image.data[currentPixel + (8 * imageWidth) - 4]		+= err * 2;
		image.data[currentPixel + (8 * imageWidth)]			+= err * 3;
		image.data[currentPixel + (8 * imageWidth) + 4]		+= err * 2;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Sierra 2-row Dither to Image Data
function dither_sierratworow (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 16;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 4;
		image.data[currentPixel + 8]						+= err * 3;

		image.data[currentPixel + (4 * imageWidth) - 8]		+= err * 1;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 2;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 3;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 2;
		image.data[currentPixel + (4 * imageWidth) + 8]		+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}


// Apply Sierra Lite Dither to Image Data
function dither_sierralite (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 4;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 2;

		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 1;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Stucki Dither to Image Data
function dither_stucki (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 42;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 8;
		image.data[currentPixel + 8]						+= err * 4;

		image.data[currentPixel + (4 * imageWidth) - 8]		+= err * 2;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 8;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth) + 8]		+= err * 2;

		image.data[currentPixel + (8 * imageWidth) - 8]		+= err * 1;
		image.data[currentPixel + (8 * imageWidth) - 4]		+= err * 2;
		image.data[currentPixel + (8 * imageWidth)]			+= err * 4;
		image.data[currentPixel + (8 * imageWidth) + 4]		+= err * 2;
		image.data[currentPixel + (8 * imageWidth) + 8]		+= err * 1;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

// Apply Burkes Dither to Image Data
function dither_burkes (image, imageWidth, drawColour) {
	skipPixels = 4;

	if (!drawColour)
		drawColour = false;

	if(drawColour == true)
		skipPixels = 1;

	imageLength	= image.data.length;

	for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

		if (image.data[currentPixel] <= 128) {

			newPixelColour = 0;

		} else {

			newPixelColour = 255;

		}

		err = (image.data[currentPixel] - newPixelColour) / 32;
		image.data[currentPixel] = newPixelColour;

		image.data[currentPixel + 4]						+= err * 8;
		image.data[currentPixel + 8]						+= err * 4;

		image.data[currentPixel + (4 * imageWidth) - 8]		+= err * 2;
		image.data[currentPixel + (4 * imageWidth) - 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth)]			+= err * 8;
		image.data[currentPixel + (4 * imageWidth) + 4]		+= err * 4;
		image.data[currentPixel + (4 * imageWidth) + 8]		+= err * 2;

		if (drawColour == false)
			image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

	}

	return image.data;
}

function dither_threshold (image, threshold_value) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i]		= (image.data[i] > threshold_value) ? 255 : 0;
		image.data[i + 1]	= (image.data[i + 1] > threshold_value) ? 255 : 0;
		image.data[i + 2]	= (image.data[i + 2] > threshold_value) ? 255 : 0;

	}
}

function replace_colours (image, black, white) {

	for (var i = 0; i <= image.data.length; i += 4) {

		image.data[i]		= (image.data[i] < 127) ? black.r : white.r;
		image.data[i + 1]	= (image.data[i + 1] < 127) ? black.g : white.g;
		image.data[i + 2]	= (image.data[i + 2] < 127) ? black.b : white.b;
		image.data[i + 3]	= (((image.data[i]+image.data[i+1]+image.data[i+2])/3) < 127) ? black.a : white.a;

	}

}

self.addEventListener('message', function (e) {
	self.postMessage(draw(e.data));
}, false);