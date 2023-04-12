/* -------------------------------------------------------------------------------
 ------------------------------- HELPER FUNCTIONS --------------------------------
 ------------------------------------------------------------------------------- */

const { css } = require("jquery");

// Convert ISO to JS date
const isoStringToDate = (s) => {
  var b = s.split(/[-t:+z]/gi);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5]));
};

// General callback function for fs.writeFile
// Define callback for writing new file
const writeFileCallback = (err) => {
  if (err) {
    console.log("An error occured writing to JSON.");
    return;
  }
  console.log("Successfully updated JSON.");
  return;
};

// Stores name-value pair as cookie (expires after exdays)
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Retrieves value from name-value pair of cookie
// (note that all name-value pairs are stored in one string of the cookie)
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Loads a desired color scheme template given the colorscheme.json file
function loadColorTheme(colorsJSON, theme) {
  // colorsJSON needs to be in a data format, i.e. loaded using "getJSON" and called in the callback function of "getJSON"
  // theme (string) describing the position of the theme (e.g. "Default") as indicated in colorscheme.json
  var thisThemeIndex = colorsJSON.findIndex(
    (lookedUpTheme) => lookedUpTheme.themeName === theme
  );
  var thisTheme = colorsJSON[thisThemeIndex];
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
    Math.floor((1-alpha)*backgroundRGB[0] + alpha*rgb[0]),
    Math.floor((1-alpha)*backgroundRGB[1] + alpha*rgb[1]),
    Math.floor((1-alpha)*backgroundRGB[2] + alpha*rgb[2])
  ];
  return rgbValues;
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
}

/* -------------------------------------------------------------------------------
------------------------------ GENERAL FUNCTIONS --------------------------------
------------------------------------------------------------------------------- */
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
--------------------------- SELECTION BOX FUNCTIONS ------------------------------
------------------------------------------------------------------------------- */
function expandSelectionBox(
  element,
  strHeader,
  strText,
  expWidth,
  animTime,
  colorScheme,
  initialFlexBasis
) {
  /*
  Params:   element:          jQuery-object of the selection box' div, e.g. "$('#selectionDiv')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            expWidth:         How far the DIV should expand, in vh
            strHeader:        The title/header string which has to be displayed as the box is expanded.
            strText           The subtitle/text string which has to be displayed as the box is expanded.
            animTime:         Duration of animation
            colorScheme:      The in EJS selected/generated color scheme
            initialFlexBasis: The initial width (flex-basis) of the selection box
  Flags:    -
  Action:                     Animation when mouse entering a selection box:
                              1. Expands the box and displays a title string
                              2. Inverts colors of the box
  Returns:  -
  */
  // Check if already expanded, if so return:
  if (parseInt(element.css("flex-basis")) > initialFlexBasis) {
    resetSelectionBox(element, colorScheme, initialFlexBasis);
    return;
  }
  var svg = element.children("svg");
  var paths = svg.children("g").children("path");
  // Change text and background color of entire box
  element.css("background-color", RGBtoHEX(colorScheme[1]));
  element.css("color", RGBtoHEX(colorScheme[0]));
  // Change color of paths in SVG
  paths.each((index, path) => {
    $(path).attr("fill", RGBtoHEX(colorScheme[0]));
  });
  // Change cursor-type
  element.css("cursor", "pointer");
  // Expand DIV only if DIV still wider than 20px and aspect ratio W/H > 1.7
  if (
    parseInt(element.css("width")) > 20 &&
    $(window).width() / $(window).height() > 1.7
  ) {
    // Before expanding, fix the values of width and height so it doesn't change size while expanding
    var currSVGHeight;
    var currSVGWidth;
    svg.each((index, item) => {
      currSVGHeight = parseInt($(item).height());
      currSVGWidth = parseInt($(item).width());
      $(item).css("height", `${currSVGHeight}`);
      $(item).css("width", `${currSVGWidth}`);
    });
    // Add the title and subtitle texts (CSS in global.css)
    element.append(
      `<div class="selectionBoxDiv"><p class="selectionBoxHeader">${strHeader}</p><p class="selectionBoxText">${strText}</p></div>`
    );
    // Animate the expansion and fade the texts in once complete
    element.animate(
      {
        "flex-basis": `+=${expWidth}vh`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {
          $(".selectionBoxDiv").animate(
            {
              opacity: "+=1",
            },
            {
              duration: animTime,
              easing: "swing",
              complete: () => {},
            }
          );
        },
      }
    );
  }
}

function contractSelectionBox(
  element,
  animTime,
  colorScheme,
  initialFlexBasis
) {
  /*
  Params:   element:         jQuery-object of the selection box' div, e.g. "$('#selectionDiv')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            animTime:         Duration of animation
            colorScheme:      The in EJS selected/generated color scheme
            initialFlexBasis: The initial width (flex-basis) of the selection box
                              => Has to be retrieved in the HTML script
  Flags:    -
  Action:                     Animation when mouse leaving a selection box:
                              1. Stops all ongoing animations
                              2. Contracts the box and removes title strings
                              3. Inverts colors of the box
  Returns:  -
  */
  var svg = element.children("svg");
  var paths = svg.children("g").children("path");
  // Change cursor-type back
  element.css("cursor", "default");
  // Change colors back and reset widths and heights of SVG
  element.css("background-color", "transparent");
  element.css("color", RGBtoHEX(colorScheme[1]));
  paths.each((index, path) => {
    $(path).attr("fill", RGBtoHEX(colorScheme[1]));
  });
  // Expand DIV only if selectionBoxDiv even available
  // (i.e. if in expandSelectionBox it fulfilled min-width and aspect ratio)
  if (element.find(".selectionBoxDiv").length) {
    // Fade out text and contract box
    $(".selectionBoxDiv").animate(
      {
        opacity: `-=${parseInt($(".selectionBoxDiv").css("opacity"))}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {
          // Remove the title and subtitle texts (CSS in global.css)
          $(".selectionBoxHeader").remove();
          $(".selectionBoxText").remove();
          element.animate(
            {
              "flex-basis": `-=${
                parseInt(element.css("flex-basis")) - initialFlexBasis
              }`,
            },
            {
              duration: animTime,
              easing: "swing",
              complete: () => {
                // Remove entire div here after individual child texts, since otherwise animation shown wrong
                $(".selectionBoxDiv").remove();
                svg.each((index, item) => {
                  $(item).css("height", "");
                  $(item).css("width", "");
                });
              },
            }
          );
        },
      }
    );
  }
}

function resetSelectionBox(element, colorScheme, initialFlexBasis) {
  /*
  Params:   element:          jQuery-object of the selection box' div, e.g. "$('#selectionDiv')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            colorScheme:      The in EJS selected/generated color scheme
            initialFlexBasis: The initial width (flex-basis) of the selection box
                              => Has to be retrieved in the HTML script
  Flags:    -
  Action:                     Stops all animations and harshly resets a selection box to its ground state
  Returns:  -
  */
  var svg = element.children("svg");
  var paths = svg.children("g").children("path");
  // Stop ongoing anims
  element.filter(":animated").stop(true);
  // Reset all changes made in selection box functions
  $(".selectionBoxDiv").remove();
  element.css("flex-basis", initialFlexBasis);
  element.css("cursor", "default");
  element.css("background-color", RGBtoHEX(colorScheme[0]));
  element.css("color", RGBtoHEX(colorScheme[1]));
  paths.each((index, path) => {
    $(path).attr("fill", RGBtoHEX(colorScheme[1]));
  });
  svg.each((index, item) => {
    $(item).css("height", "");
    $(item).css("width", "");
  });
}

/* -------------------------------------------------------------------------------
------------------------------- BUTTON FUNCTIONS ---------------------------------
------------------------------------------------------------------------------- */
function hoverButton(element, colorScheme, reverseFlag = false) {
  /*
  Params:   element:          jQuery-object of the button's div, e.g. "$('#button')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            colorScheme:      The in EJS selected/generated color scheme
  Flags:    reverse:          If true, plays animation backwords (i.e. when mouseleave)
  Action:                     Switches colors of button and displays cursor as "pointer"
  Returns:  -
  */
  if (!reverseFlag) {
    element.css("background-color", RGBtoHEX(colorScheme[1]));
    element.css("color", RGBtoHEX(colorScheme[0]));
    element.css("cursor", "pointer");
    element.css("font-weight", 800);
    element.css("border-color", RGBtoHEX(colorScheme[1]));
  } else {
    element.css("background-color", "transparent");
    element.css("color", RGBtoHEX(colorScheme[1]));
    element.css("cursor", "default");
    element.css("font-weight", 500);
    element.css("border-color", RGBtoHEX(colorScheme[1]));
  }
}

/* -------------------------------------------------------------------------------
---------------------------------- INDEX.EJS -------------------------------------
------------------------------------------------------------------------------- */
function hoverMenupoint(elementNo, animTime, colorScheme, reverseFlag = false) {
  /*  
    Params:   elementNo:    Number of menupoint to which logo should move (0=left, 3=right)
              animTime:     Duration of animation
              colorScheme:  The in EJS selected/generated color scheme
    Flags:    reverse:      If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves center of logo to center of chosen menupoint and changes color
    Returns:  - 
  */
  // Get element
  const element = $(`#h2menu${elementNo}`);
  // Start RGB color change
  linearlyChangeRGB(
    colorScheme[elementNo + 2],
    animTime / 8,
    $("#movingbar"),
    "background-color",
    false
  );
  linearlyChangeRGB(
    colorScheme[elementNo + 2],
    animTime / 8,
    $("#logo-svg-V"),
    "fill",
    true
  );
  // Initialize movement animation
  if (!reverseFlag) {
    // Change cursor type and color of element
    element.css("cursor", "pointer");
    element.css(
      "color",
      `rgb(${colorScheme[elementNo + 2][0]},${colorScheme[elementNo + 2][1]},${
        colorScheme[elementNo + 2][2]
      })`
    );
    // Get x-coordinate of center of element (= center of window)
    var x = element.offset().left + element.width() / 2;
    // Get x-coordinate of center of logo
    var x_logo = window.innerWidth / 2;
    // Fade out and hide explore-div
    $("#explore").animate(
      {
        opacity: "-=1",
      },
      {
        duration: 250,
        easing: "swing",
        complete: () => {},
      }
    );
    $("#explore").css("display", "hidden");
    // Move logo to menupoint
    var dx = x_logo - x;
    $("#logo").animate(
      {
        left: `-=${dx}px`,
      },
      {
        duration: 500,
        easing: "swing",
        complete: () => {},
      }
    );
    // Also move "pencil line" bar by the same amount
    $("#movingbar").animate(
      {
        left: `-=${dx}px`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );

    // If reverseFlag = true:
  } else {
    $(":animated")
      .filter(":not(#explore, #butOptions, #butSocials)")
      .stop(true); // Stop ongoing anims
    // Change element cursor and color back to black
    // Change cursor type and color of element
    element.css("cursor", "default");
    element.css(
      "color",
      `rgb(${colorScheme[1][0]},${colorScheme[1][1]},${colorScheme[1][2]})`
    );
    // Change svg/movingbar back to black
    linearlyChangeRGB(
      colorScheme[1],
      animTime / 8,
      $("#movingbar"),
      "background-color",
      false
    );
    linearlyChangeRGB(
      colorScheme[1],
      animTime / 8,
      $("#logo-svg-V"),
      "fill",
      true
    );
    // Get current position of logo
    var currentLogoLeft = parseFloat($("#logo").css("left"));
    var sign = "-";
    if (currentLogoLeft < 0) {
      currentLogoLeft = Math.abs(currentLogoLeft);
      sign = "+";
    }
    // Move Logo back
    $("#logo").animate(
      {
        left: `${sign}=${currentLogoLeft}px`,
      },
      {
        duration: 500,
        easing: "swing",
        complete: () => {},
      }
    );
    $("#movingbar").animate(
      {
        left: `${sign}=${currentLogoLeft}px`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    // Fade in explore-div
    $("#explore").css("display", "flex");
    $("#explore").animate(
      {
        opacity: "+=1",
      },
      {
        duration: 500,
        easing: "swing",
        complete: () => {},
      }
    );
  }
}

function hoverExplore(
  animTime,
  colorScheme,
  initialFontWeight,
  initialStrokeWidth,
  reverseFlag = false
) {
  /*  
    Params:   animTime:             Duration of animation
              colorScheme:          The in EJS selected/generated color scheme
              initialFontWeight:    Current font-weight (const), extracted in EJS code before calling the function.
              initialStrokeWidth:   Current stroke-width (const), extracted in EJS code before calling the function.
    Flags:    reverse:              If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves "START TOUR" button 1vh to the right and displays bold and clickable, reverses if flag true.
    Returns:  - 
  */
  $("#explore :animated").stop(true);
  if (!reverseFlag) {
    // Get difference in stroke-width and font-weight to subtract
    var diffStrokeWidth =
      initialStrokeWidth +
      50 -
      parseInt($(".exploreArrowPolygon").css("stroke-width"));
    var diffFontWeight =
      initialFontWeight + 300 - parseInt($(".exploreText").css("font-weight"));
    var diffRightShift =
      parseInt(window.innerWidth / 100) - parseInt($(".explore").css("right"));
    $(".explore").css("cursor", "pointer");
    $(".explore").animate(
      {
        right: `-=${diffRightShift}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".exploreArrowPolygon").animate(
      {
        "stroke-width": `+=${diffStrokeWidth}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".exploreText").animate(
      {
        "font-weight": `+=${diffFontWeight}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
  } else {
    // Get difference in stroke-width and font-weight to subtract
    var diffStrokeWidth =
      parseInt($(".exploreArrowPolygon").css("stroke-width")) -
      initialStrokeWidth;
    var diffFontWeight =
      parseInt($(".exploreText").css("font-weight")) - initialFontWeight;
    var currRightShift = parseInt($(".explore").css("right"));
    $(".explore").css("cursor", "default");
    $(".explore").animate(
      {
        right: `-=${currRightShift}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".exploreArrowPolygon").animate(
      {
        "stroke-width": `-=${diffStrokeWidth}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".exploreText").animate(
      {
        "font-weight": `-=${diffFontWeight}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
  }
}

function hoverArrow(
  animTime,
  colorScheme,
  initialStrokeWidth,
  arrowDirection,
  reverseFlag = false
) {
  /*  
    Params:   animTime:             Duration of animation
              colorScheme:          The in EJS selected/generated color scheme
              initialStrokeWidth:   Current stroke-width (const), extracted in EJS code before calling the function.
              arrowDirection:       "Left" or "Right", depending on which side arrow
    Flags:    reverse:              If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves "arrows 1vh to the left/right (dep. on arrowDirection) and displays bold and clickable, reverses if flag true.
    Returns:  - 
  */
  $(".arrows :animated").stop(true);
  if (!reverseFlag) {
    // Get difference in stroke-width and font-weight to subtract
    var diffStrokeWidth =
      initialStrokeWidth +
      50 -
      parseInt($(`.arrow${arrowDirection}Container`).css("stroke-width"));
    $(`.arrow${arrowDirection}Container`).css("cursor", "pointer");
    $(`.arrow${arrowDirection}Polygon`).animate(
      {
        "stroke-width": `+=${diffStrokeWidth}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    if (arrowDirection == "Right") {
      var diffRightShift =
        parseInt(window.innerWidth / 100) -
        parseInt($(`.arrow${arrowDirection}Container`).css("right"));
      $(`.arrow${arrowDirection}Container`).animate(
        {
          right: `-=${diffRightShift}`,
        },
        {
          duration: animTime,
          easing: "swing",
          complete: () => {},
        }
      );
    } else {
      var diffLeftShift =
        parseInt(window.innerWidth / 100) -
        parseInt($(`.arrow${arrowDirection}Container`).css("left"));
      $(`.arrow${arrowDirection}Container`).animate(
        {
          left: `-=${diffLeftShift}`,
        },
        {
          duration: animTime,
          easing: "swing",
          complete: () => {},
        }
      );
    }
  } else {
    // Get difference in stroke-width and font-weight to subtract
    var diffStrokeWidth =
      parseInt($(`.arrow${arrowDirection}Polygon`).css("stroke-width")) -
      initialStrokeWidth;
    $(`.arrow${arrowDirection}Container`).css("cursor", "default");
    $(`.arrow${arrowDirection}Polygon`).animate(
      {
        "stroke-width": `-=${diffStrokeWidth}`,
      },
      {
        duration: animTime,
        easing: "swing",
        complete: () => {},
      }
    );
    if (arrowDirection == "Right") {
      var currRightShift = parseInt(
        $(`.arrow${arrowDirection}Container`).css("right")
      );
      $(`.arrow${arrowDirection}Container`).animate(
        {
          right: `-=${currRightShift}`,
        },
        {
          duration: animTime,
          easing: "swing",
          complete: () => {},
        }
      );
    } else {
      var currLeftShift = parseInt(
        $(`.arrow${arrowDirection}Container`).css("left")
      );
      $(`.arrow${arrowDirection}Container`).animate(
        {
          left: `-=${currLeftShift}`,
        },
        {
          duration: animTime,
          easing: "swing",
          complete: () => {},
        }
      );
    }
  }
}

function clickThemeChange(
  element,
  animTime,
  colorsJSON,
  colorTheme,
  initialFlexBasis
) {
  /*
  Params:   element:          jQuery-object of the selection box' div, e.g. "$('#selectionDiv')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            animTime:         Duration of animation
            colorsJSON:       The in EJS loaded JSON file containing the color schemes
            colorTheme:       The name of the color theme, as defined in colorJSON
            initialFlexBasis: The initial width (flex-basis) of the selection box
                              => Has to be retrieved in the HTML script
  Flags:    -
  Action:                     Changes the color scheme, updates necessary CSS and contracts box again
  Returns:                    The new color scheme
  */
  // Load color scheme from JSON
  colors = loadColorTheme(colorsJSON, colorTheme);
  initializeCSSColorTheme(colors);
  // Manually (needed) update CSS of menupoints and explore button
  $("#h2menu0").css(
    "color",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#h2menu1").css(
    "color",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#h2menu2").css(
    "color",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#h2menu3").css(
    "color",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#exploreText").css(
    "color",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#exploreArrowPolygon").css(
    "fill",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  $("#exploreArrowPolygon").css(
    "stroke",
    `rgb(${colors[1][0]},${colors[1][1]},${colors[1][2]})`
  );
  // Contract selection box again
  contractSelectionBox(element, 300, colors, initialFlexBasis);
  // Return the new scheme
  return colors;
}

function firstLoadIndexAnimation(reverseFlag) {
  /*
  Params:   -
  Flags:    reverseFlag:      If true, prepares the animation by placing the elements to their start position (with 0ms anim time)
                              If false, plays the animation normally.
  Action:                     Fades in the index page elements.
  Returns:                    -
  */
  // Prepare the animation by placing the elements outside of the page
  // and their opacity to 0
  if (reverseFlag) {
    $(".movingbar").animate(
      {
        left: `-=${window.innerWidth}`,
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".logo").animate(
      {
        left: `-=${window.innerWidth}`,
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );

    $(".title").animate(
      {
        top: "-=10vh",
        opacity: "-=1",
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".butSocials").animate(
      {
        top: "-=10vh",
        opacity: "-=1",
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".butOptions").animate(
      {
        top: "-=10vh",
        opacity: "-=1",
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".menu").animate(
      {
        top: "+=10vh",
        opacity: "-=1",
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".explore").animate(
      {
        right: "-=10vw",
        opacity: "-=1",
      },
      {
        duration: 0,
        easing: "swing",
        complete: () => {},
      }
    );
  } else {
    $(".movingbar").animate(
      {
        left: `+=${window.innerWidth}`,
      },
      {
        duration: 3000,
        easing: "swing",
        complete: () => {},
      }
    );
    $(".logo").animate(
      {
        left: `+=${window.innerWidth}`,
      },
      {
        duration: 3000,
        easing: "swing",
        complete: () => {
          $(".title").animate(
            {
              top: "+=10vh",
              opacity: "+=1",
            },
            {
              duration: 1000,
              easing: "swing",
              complete: () => {},
            }
          );
          $(".butSocials").animate(
            {
              top: "+=10vh",
              opacity: "+=1",
            },
            {
              duration: 1000,
              easing: "swing",
              complete: () => {},
            }
          );
          $(".butOptions").animate(
            {
              top: "+=10vh",
              opacity: "+=1",
            },
            {
              duration: 1000,
              easing: "swing",
              complete: () => {},
            }
          );
          $(".menu").animate(
            {
              top: "-=10vh",
              opacity: "+=1",
            },
            {
              duration: 1000,
              easing: "swing",
              complete: () => {},
            }
          );
          $(".explore").animate(
            {
              right: "+=10vw",
              opacity: "+=1",
            },
            {
              duration: 1000,
              easing: "swing",
              complete: () => {},
            }
          );
        },
      }
    );
  }
}

/* -------------------------------------------------------------------------------
---------------------------------- NAVIGATION ------------------------------------
------------------------------------------------------------------------------- */
function changeSubmenuAnimation(
  oldClassNo,
  newClassNo,
  colorScheme,
  indexFlag,
  reverseDirFlag = false
) {
  /*
  Params:   oldClassNo:         The (additional) class of ALL elements that belong to the menu/content that will be faded out
                              --> NEEDS TO BE SET-UP FOR ALL ELEMENTS IN THE HTML
                              --> Parameter: INTEGER (e.g. "0" for Grouped Class "GC0")
            newClassNo:         The (additional) class of ALL elements that belong to the menu/content that will be faded in
                              --> NEEDS TO BE SET-UP FOR ALL ELEMENTS IN THE HTML
                              --> Parameter: INTEGER (e.g. "1" for Grouped Class "GC1")
            colorScheme:      The in EJS selected/generated color scheme
  Flags:    indexFlag:        If true, adapts animation for the transition INDEX -> SUBMENU (or vice versa if reverseDirFlag = true)
            reverseDirFlag:   If false:   Anim direction: Left -> Right
                              If true:    Anim direction: Right -> Left
  Action:                     Plays the animation required to change submenus
  Returns:                    -
  */
  // Assign class names to integers
  var oldClass = `GC${oldClassNo}`;
  var newClass = `GC${newClassNo}`;
  // Define animation time
  const animTimeLogo = 1000;
  const animTimeMove = animTimeLogo * 2;
  // 0. Fade out explore button (if index) or arrow buttons (if other)
  if (indexFlag && !reverseDirFlag) {
    $(".explore").animate(
      {
        opacity: "-=1",
      },
      {
        duration: animTimeLogo / 4,
        easing: "swing",
        complete: () => {},
      }
    );
  } else {
    $(`#${oldClass}-arrowLeft`).animate(
      {
        opacity: "-=1",
      },
      {
        duration: animTimeLogo / 4,
        easing: "swing",
        complete: () => {},
      }
    );
    $(`#${oldClass}-arrowRight`).animate(
      {
        opacity: "-=1",
      },
      {
        duration: animTimeLogo / 4,
        easing: "swing",
        complete: () => {},
      }
    );
  }

  // 1. Move logo out of screen
  // -------------------------------------------
  var colorSchemeIndex = newClassNo + 1; // Get color of subdivision for background
  // Set color to standard background color if going back to index page
  if (indexFlag && reverseDirFlag) {
    colorSchemeIndex = 0;
  }
  var amountToMove = window.innerWidth;
  // If reverse direction, negate amount to move.
  if (reverseDirFlag) {
    amountToMove = -amountToMove;
    // Change classes if reverse direction
    var tempClass = oldClass;
    oldClass = newClass;
    newClass = tempClass;
  }
  // Animation
  $("#logo").animate(
    {
      left: `+=${amountToMove / 4}px`,
    },
    {
      duration: animTimeLogo,
      easing: "swing",
      complete: () => {},
    }
  );
  // Define a flag that tracks if the progress of the movingbar animation has been tracked already above 0.5
  // This needs to be tracked for starting the following animation as soon as the movingbar has reached the right end of screen.
  var firstProgRead = true;
  // Movingbar animation
  $("#movingbar").animate(
    {
      left: `+=${amountToMove / 4}px`,
    },
    {
      duration: animTimeLogo,
      easing: "swing",
      progress: (anim, prog) => {
        // 2. As soon as logo halfway through movement:
        // Place new contents out of screen, so they can be moved in along with other animation
        // -------------------------------------------
        if (prog >= 0.5 && firstProgRead) {
          // Change background colors (with alpha=0.5)
          linearlyChangeRGB(
            RGBAtoRGB(colorScheme[colorSchemeIndex], 0.2, colorScheme[0]),
            animTimeMove/8,
            $("html"),
            "background-color",
            false
          );
          firstProgRead = false; // Progress has been read once above 0.5
          $(`.${newClass}`).css("position", "relative");
          $(`.${newClass}`).animate(
            {
              left: `+=${amountToMove}px`,
            },
            {
              duration: 0,
            }
          );
          $(`.${newClass}`).show();
          // 3. Move content to the opposite side along with logo,
          //    so it looks like the observer moves to the right
          // -------------------------------------------
          $("#logo").animate(
            {
              left: `-=${amountToMove / 4}px`,
            },
            {
              duration: animTimeMove * 0.75,
              easing: "swing",
              complete: () => {},
            }
          );
          $("#movingbar").animate(
            {
              left: `-=${amountToMove / 4}px`,
            },
            {
              duration: animTimeMove * 0.75,
              easing: "swing",
              complete: () => {},
            }
          );
          $(`.${newClass}`).animate(
            {
              left: `-=${amountToMove}px`,
            },
            {
              duration: animTimeMove,
              easing: "swing",
              complete: () => {},
            }
          );
          $(`.${oldClass}`).animate(
            {
              left: `-=${amountToMove}px`,
            },
            {
              duration: animTimeMove,
              easing: "swing",
              complete: () => {
                // Fade out and reposition old class
                $(`.${oldClass}`).hide();
                $(`.${oldClass}`).css("left", 0);
                // 4. Fade in left/right arrows or explore arrow
                // -------------------------------------------
                if (indexFlag && reverseDirFlag) {
                  $(".explore").animate(
                    {
                      opacity: "+=1",
                    },
                    {
                      duration: 500,
                      easing: "swing",
                      complete: () => {},
                    }
                  );
                } else {
                  $(`#${newClass}-arrowLeft`).animate(
                    {
                      opacity: "+=1",
                    },
                    {
                      duration: 500,
                      easing: "swing",
                      complete: () => {},
                    }
                  );
                  $(`#${newClass}-arrowRight`).animate(
                    {
                      opacity: "+=1",
                    },
                    {
                      duration: 500,
                      easing: "swing",
                      complete: () => {},
                    }
                  );
                }
              },
            }
          );
        }
      },
    }
  );
}

/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.RGBtoHEX = RGBtoHEX;
window.loadColorTheme = loadColorTheme;
window.initializeCSSColorTheme = initializeCSSColorTheme;
window.linearlyChangeRGB = linearlyChangeRGB;

window.expandSelectionBox = expandSelectionBox;
window.contractSelectionBox = contractSelectionBox;
window.resetSelectionBox = resetSelectionBox;

window.hoverMenupoint = hoverMenupoint;
window.hoverExplore = hoverExplore;
window.clickThemeChange = clickThemeChange;
window.firstLoadIndexAnimation = firstLoadIndexAnimation;
window.changeSubmenuAnimation = changeSubmenuAnimation;
*/
