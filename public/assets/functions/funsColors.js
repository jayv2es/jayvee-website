/* -------------------------------------------------------------------------------
-------------------------------- COLOR FUNCTIONS ---------------------------------
------------------------------------------------------------------------------- */
// Convert RGB to HEX (inputs rgb-array (1x3), returns HEX-string)
function RGBtoHEX(rgb) {
  // [R1,R2,G1,G2,B1,B2]
  var hexValues = [
    Math.floor(rgb[0] / 16),
    rgb[0] % 16,
    Math.floor(rgb[1] / 16),
    rgb[1] % 16,
    Math.floor(rgb[2] / 16),
    rgb[2] % 16,
  ];
  var hexString = "#";
  for (var i = 0; i < hexValues.length; i++) {
    var hexStringAppend;
    switch (hexValues[i]) {
      case 10:
        hexStringAppend = "A";
        break;
      case 11:
        hexStringAppend = "B";
        break;
      case 12:
        hexStringAppend = "C";
        break;
      case 13:
        hexStringAppend = "D";
        break;
      case 14:
        hexStringAppend = "E";
        break;
      case 15:
        hexStringAppend = "F";
        break;
      default:
        hexStringAppend = `${hexValues[i]}`;
    }
    hexString += hexStringAppend;
  }
  return hexString;
}

// Convert RGB + alpha value to RGB (inputs rgb-array (1x3) + alpha-scalar + rgb-array of Background (1x3), returns rgb-array (1x3))
function RGBAtoRGB(rgb, alpha, backgroundRGB) {
  var rgbValues = [
    Math.floor((1 - alpha) * backgroundRGB[0] + alpha * rgb[0]),
    Math.floor((1 - alpha) * backgroundRGB[1] + alpha * rgb[1]),
    Math.floor((1 - alpha) * backgroundRGB[2] + alpha * rgb[2]),
  ];
  return rgbValues;
}

// Loads a desired color scheme template given the colorscheme.json file
function loadColorTheme(colorsJSON, index) {
  // colorsJSON needs to be in a data format, i.e. loaded using "getJSON" and called in the callback function of "getJSON"
  // index is either 0 (light) or 1 (dark)
  var thisTheme = colorsJSON[index];
  // Define an empty array to store RGB values
  var thisThemeArr = Object.values(thisTheme).slice(
    2,
    Object.values(thisTheme).length - 1
  ); // Exclude first 2 and last from MongoDB
  var colorScheme = new Array(thisThemeArr.length);
  // For each position in the array, store the corresponding RGB values
  for (var i = 0; i < thisThemeArr.length; i++) {
    colorScheme[i] = [
      thisThemeArr[i].red,
      thisThemeArr[i].blue,
      thisThemeArr[i].green,
    ];
  }
  return colorScheme;
}

// Initializes the CSS of the website with a desired color theme
function initializeCSSColorTheme(colorSchemeRGB) {
  var colorSchemeHEX = new Array(colorSchemeRGB.length);
  for (var i = 0; i < colorSchemeHEX.length; i++) {
    colorSchemeHEX[i] = RGBtoHEX(colorSchemeRGB[i]);
  }
  $("html").css("background-color", colorSchemeHEX[0]);
  $("html").css("color", colorSchemeHEX[1]);
  $("#movingbar").css("background-color", colorSchemeHEX[1]);
  $("#logo-svg-J").attr("fill", colorSchemeHEX[1]);
  $("#logo-svg-V").attr("fill", colorSchemeHEX[1]);

  $(".butSocial").css("border-color", colorSchemeHEX[1]);
  $(".butOption").css("border-color", colorSchemeHEX[1]);

  $(".butOptionIcon").attr("fill", colorSchemeHEX[1]);

  $("#exploreText").css("color", colorSchemeHEX[1]);
  $("#exploreArrowPolygon").css("fill", colorSchemeHEX[1]);
  $("#exploreArrowPolygon").css("stroke", colorSchemeHEX[1]);

  $(".arrowLeftPolygon").css("fill", colorSchemeHEX[1]);
  $(".arrowLeftPolygon").css("stroke", colorSchemeHEX[1]);
  $(".arrowRightPolygon").css("fill", colorSchemeHEX[1]);
  $(".arrowRightPolygon").css("stroke", colorSchemeHEX[1]);

  $(".divAnimationFill").css(
    "fill",
    `rgb(${colorSchemeRGB[1][0]},${colorSchemeRGB[1][1]},${colorSchemeRGB[1][2]})`
  );
}

function linearlyChangeRGB(
  rgbEnd,
  animTime,
  element,
  property,
  attrFlag = false
) {
  /*  
    Params:   rgbEnd:     The RGB-values desired at the end of the animation (array-like)
              animTime:   Duration of animation
              element:    jQuery-element to change colors
              property:   CSS- or attr-property of element that needs to change color
    Flags:    attrFlag:   If true, treats attribute instead of CSS of an object
                          (i.e. element.attr(...) instead of element.css(...)) 
    Action:               Linearly animates the RGB values of an element.
    Returns:  -           
  */
  // First get current RGB values
  var rgbStartString = element.css(property); // retrieves the font color as a string, e.g. "rgb(0, 0, 255)"
  var rgbStartArray = rgbStartString
    .substring(4, rgbStartString.length - 1)
    .split(","); // splits the string into an array of RGB values
  var rgbStart = [
    parseInt(rgbStartArray[0]),
    parseInt(rgbStartArray[1]),
    parseInt(rgbStartArray[2]),
  ];
  // Calculate necessary information
  var rgbDiff = [
    rgbEnd[0] - rgbStart[0],
    rgbEnd[1] - rgbStart[1],
    rgbEnd[2] - rgbStart[2],
  ];
  var millisecsInterval = 2; // ms-intervals between rgb changes
  var rgbSteps = Math.floor(animTime / millisecsInterval); // Total number of steps for rgb change
  var stepCtr = 0; // Ctr for rgb-steps
  var rgbCurrent = rgbStart; // Set current RGB value to start value
  let animInterval = setInterval(() => {
    // Stop interval if transition completed
    if (stepCtr >= rgbSteps) {
      clearInterval(animInterval);
      return;
    }
    // Else, calculate new RGB values and assign
    rgbCurrent[0] += rgbDiff[0] / rgbSteps;
    rgbCurrent[1] += rgbDiff[1] / rgbSteps;
    rgbCurrent[2] += rgbDiff[2] / rgbSteps;
    stepCtr++;
    if (attrFlag) {
      element.attr(
        property,
        `rgb(${rgbCurrent[0]},${rgbCurrent[1]},${rgbCurrent[2]})`
      );
    } else {
      element.css(
        property,
        `rgb(${rgbCurrent[0]},${rgbCurrent[1]},${rgbCurrent[2]})`
      );
    }
  }, millisecsInterval);
}

/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.RGBtoHEX = RGBtoHEX;
window.RGBAtoRGB = RGBAtoRGB;
window.loadColorTheme = loadColorTheme;
window.initializeCSSColorTheme = initializeCSSColorTheme;
window.linearlyChangeRGB = linearlyChangeRGB;
*/