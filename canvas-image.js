var imageDisplay, displayCanvas, displayContext, displayImage, displayImageData, originalImage;
var worker		= new Worker('canvas-image-worker.js');
var fileReader	= new FileReader();

function draw () {

	displayImage				= new Image();
	displayImage.src			= originalImage;

	displayCanvas.width			= displayImage.width;
	displayCanvas.height		= displayImage.height;

	displayContext				= displayCanvas.getContext('2d');

	displayContext.drawImage(displayImage, 0, 0);

	displayImageData			= displayContext.getImageData(0,0,displayCanvas.width,displayCanvas.height);

	if (document.getElementById('rdo_grayscale_average').checked) tmpGrayscaleMethod = "average";
	if (document.getElementById('rdo_grayscale_decomposition').checked) tmpGrayscaleMethod = "decomposition";
	if (document.getElementById('rdo_grayscale_desaturation').checked) tmpGrayscaleMethod = "desaturation";
	if (document.getElementById('rdo_grayscale_luminance').checked) tmpGrayscaleMethod = "luminance";
	if (document.getElementById('rdo_grayscale_shades').checked) tmpGrayscaleMethod = "shades";
	var tmpGrayscaleShades		= document.getElementById('rng_shades').value;
	if (document.getElementById('rdo_grayscale_singlechannel').checked) tmpGrayscaleMethod = "singlechannel";
	var tmpGrayscaleChannel		= document.getElementById('rng_singlechannel').value;
	if (document.getElementById('rdo_grayscale_disable').checked) tmpGrayscaleMethod = "disable";

	if (document.getElementById('rdo_dither_disable').checked) tmpDitherMethod = "disable";
	if (document.getElementById('rdo_dither_atkinson').checked) tmpDitherMethod = "atkinson";
	if (document.getElementById('rdo_dither_burkes').checked) tmpDitherMethod = "burkes";
	if (document.getElementById('rdo_dither_falsefloydsteinberg').checked) tmpDitherMethod = "falsefloydsteinberg";
	if (document.getElementById('rdo_dither_floydsteinberg').checked) tmpDitherMethod = "floydsteinberg";
	if (document.getElementById('rdo_dither_jarvisjudiceninke').checked) tmpDitherMethod = "jarvisjudiceninke";
	if (document.getElementById('rdo_dither_sierra').checked) tmpDitherMethod = "sierra";
	if (document.getElementById('rdo_dither_sierratworow').checked) tmpDitherMethod = "sierratworow";
	if (document.getElementById('rdo_dither_sierralite').checked) tmpDitherMethod = "sierralite";
	if (document.getElementById('rdo_dither_stucki').checked) tmpDitherMethod = "stucki";
	if (document.getElementById('rdo_dither_threshold').checked) tmpDitherMethod = "threshold";
	var tmpDitherThreshold		= document.getElementById('rng_threshold').value;

	var tmpReplaceColours 		= document.getElementById('chk_replace_colours').checked;
	var tmpReplaceBlack = {
		r: document.getElementById('rep_black_r').value,
		g: document.getElementById('rep_black_g').value,
		b: document.getElementById('rep_black_b').value,
		a: document.getElementById('rep_black_a').value
	}
	var tmpReplaceWhite = {
		r: document.getElementById('rep_white_r').value,
		g: document.getElementById('rep_white_g').value,
		b: document.getElementById('rep_white_b').value,
		a: document.getElementById('rep_white_a').value
	}

	if (window.console && window.console.time) {
		console.log("Starting Web Worker for image (" + displayCanvas.width + "x" + displayCanvas.height + ", grayscale Method: " + tmpGrayscaleMethod + ", Dither Method: " + tmpDitherMethod + ")");
		console.time("Web worker took");
	}

	worker.postMessage( {
			image: {
				data:				displayImageData,
				width:				displayCanvas.width,
				height:				displayCanvas.height
			},
			processing: {
				grayscaleMethod:	tmpGrayscaleMethod,
				grayscaleShades:	tmpGrayscaleShades,
				grayscaleChannel:	tmpGrayscaleChannel,
				ditherMethod:		tmpDitherMethod,
				ditherThreshold:	tmpDitherThreshold,
				replaceColours:		tmpReplaceColours,
				replaceColourMap: {
					black: tmpReplaceBlack,
					white: tmpReplaceWhite
				}
			}
		});

}

worker.addEventListener('message', function (e) {

	displayContext			= displayCanvas.getContext('2d');

	if (window.console && window.console.time)
		console.timeEnd("Web worker took");

	displayContext.putImageData(e.data.image.data, 0, 0);

	if (document.getElementById('rdo_format_png').checked == true) {

		imageDisplay.src	= displayCanvas.toDataURL("image/png");

	} else if (document.getElementById('rdo_format_gif').checked == true) {

		imageDisplay.src	= displayCanvas.toDataURL("image/gif");

	} else if (document.getElementById('rdo_format_bmp').checked == true) {

		imageDisplay.src	= displayCanvas.toDataURL("image/bmp");
	}

}, false);

fileReader.onload = function (e) {
	originalImage = e.target.result;
	document.getElementById('displayImage').src = e.target.result;
	draw();
}

function handleFileSelect (e) {
	var files = e.target.files;

    fileReader.readAsDataURL(e.target.files[0]);
}

function setup () {

	var channels = "RGB";

	// Detect Canvas Support
	displayCanvas	= document.createElement('canvas');
	imageDisplay	= document.getElementById('displayImage');

	if (displayCanvas.getContext) {

		var inputs = document.querySelectorAll('form#grayscale input[type="radio"]')
		for (input of inputs) {
			input.addEventListener('click', function(event) {
				document.getElementById('frm_shades').style.display = 'none';
				document.getElementById('frm_singlechannel').style.display = 'none';
				draw();
			});
		}

		var inputs = document.querySelectorAll('form#dithering input[type="radio"]')
		for (input of inputs) {
			input.addEventListener('click', function(event) {
				document.getElementById('frm_threshold').style.display = 'none';
				draw();
			});
		}

		var inputs = document.querySelectorAll('form#replace input[type="range"]')
		for (input of inputs) {
			input.addEventListener('change', function(event) {
				draw();
			});
		}

		document.getElementById('rdo_dither_threshold').onclick	= function() {
			document.getElementById('frm_threshold').style.display = 'block';
			document.getElementById('rng_threshold').focus();
		};
		document.getElementById('rng_threshold').onchange = function() {
			document.getElementById('num_threshold').innerHTML = document.getElementById('rng_threshold').value;
			document.getElementById('rng_threshold').focus();
			draw();
		};

		document.getElementById('rdo_grayscale_shades').onclick = function() {
			document.getElementById('frm_shades').style.display = 'block';
			document.getElementById('rng_shades').focus();
		};
		document.getElementById('rng_shades').onchange = function() {
			document.getElementById('num_shades').innerHTML = document.getElementById('rng_shades').value;
			document.getElementById('rng_shades').focus();
			draw();
		};

		document.getElementById('rdo_grayscale_singlechannel').onclick = function() {
			document.getElementById('frm_singlechannel').style.display = 'block';
			document.getElementById('rng_singlechannel').focus();
		};
		document.getElementById('rng_singlechannel').onchange = function() {
			document.getElementById('num_singlechannel').innerHTML = channels.charAt(document.getElementById('rng_singlechannel').value);
			document.getElementById('rng_singlechannel').focus();
			draw();
		};

		document.getElementById('chk_replace_colours').onclick = function() {
			document.getElementById('frm_replace_colours').style.display = document.getElementById('frm_replace_colours').style.display == 'block' ? 'none' : 'block';
		};

		document.getElementById('fileSelect').addEventListener('change', handleFileSelect, false);
		originalImage = document.getElementById('displayImage').src;
	
	} else {

		alert("Hi there, you're using an older browser which doesn't support Canvas, so unfortunately I can't show you this demo. Sorry!");

	}

	document.onkeyup = function(e) {
		if (e.altKey) {
			// alt + numbers
			switch(e.which) {
			case "1".charCodeAt(0):
				document.getElementById('rdo_grayscale_average').click();
				break;
			case "2".charCodeAt(0):
				document.getElementById('rdo_grayscale_decomposition').click();
				break;
			case "3".charCodeAt(0):
				document.getElementById('rdo_grayscale_desaturation').click();
				break;
			case "4".charCodeAt(0):
				document.getElementById('rdo_grayscale_luminance').click();
				break;
			case "5".charCodeAt(0):
				document.getElementById('rdo_grayscale_shades').click();
				break;
			case "6".charCodeAt(0):
				document.getElementById('rdo_grayscale_singlechannel').click();
				break;
			case "0".charCodeAt(0):
				document.getElementById('rdo_grayscale_disable').click();
				break;
			default:
				// nothing
			}
		} else {
			// numbers
			switch(e.which) {
			case "i".charCodeAt(0):
			case "I".charCodeAt(0):
				document.getElementById('fileSelect').click();
				break;

			case "1".charCodeAt(0):
				document.getElementById('rdo_dither_atkinson').click();
				break;
			case "2".charCodeAt(0):
				document.getElementById('rdo_dither_burkes').click();
				break;
			case "3".charCodeAt(0):
				document.getElementById('rdo_dither_falsefloydsteinberg').click();
				break;
			case "4".charCodeAt(0):
				document.getElementById('rdo_dither_floydsteinberg').click();
				break;
			case "5".charCodeAt(0):
				document.getElementById('rdo_dither_jarvisjudiceninke').click();
				break;
			case "6".charCodeAt(0):
				document.getElementById('rdo_dither_sierra').click();
				break;
			case "7".charCodeAt(0):
				document.getElementById('rdo_dither_sierratworow').click();
				break;
			case "8".charCodeAt(0):
				document.getElementById('rdo_dither_sierralite').click();
				break;
			case "9".charCodeAt(0):
				document.getElementById('rdo_dither_stucki').click();
				break;
			case "t".charCodeAt(0):
			case "T".charCodeAt(0):
				document.getElementById('rdo_dither_threshold').click();
				break;
			case "0".charCodeAt(0):
				document.getElementById('rdo_dither_disable').click();
				break;

			case "r".charCodeAt(0):
			case "R".charCodeAt(0):
				document.getElementById('chk_replace_colours').click();
				break;

			case "p".charCodeAt(0):
			case "P".charCodeAt(0):
				document.getElementById('rdo_format_png').click();
				break;
			case "g".charCodeAt(0):
			case "G".charCodeAt(0):
				document.getElementById('rdo_format_gif').click();
				break;
			case "b".charCodeAt(0):
			case "B".charCodeAt(0):
				document.getElementById('rdo_format_bmp').click();
				break;
			
			default:
				// nothing
			}
		}

		// redraw on any key press
		draw();
	};

}

// main setup function now called in html