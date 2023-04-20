/* -------------------------------------------------------------------------------
--------------------------------- TEXT BUTTONS -----------------------------------
------------------------------------------------------------------------------- */
function hoverTextButton(element, colorsJSON, reverseFlag = false) {
  /*
  Params:   element:          jQuery-object of the button's div, e.g. "$('#button')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            colorsJSON:       colorsJSON from index page
  Flags:    reverse:          If true, plays animation backwords (i.e. when mouseleave)
  Action:                     Switches colors of button and displays cursor as "pointer"
  Returns:  -
  */
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
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
--------------------------------- ICON BUTTONS -----------------------------------
------------------------------------------------------------------------------- */
function hoverIconButton(element, colorsJSON, reverseFlag = false) {
  /*
  Params:   element:          jQuery-object of the button's div, e.g. "$('#button')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            colorsJSON:       colorsJSON from index page
  Flags:    reverse:          If true, plays animation backwords (i.e. when mouseleave)
  Action:                     Switches colors of button and displays cursor as "pointer"
  Returns:  -
  */
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
  // Get paths of icon
  var svg = element.children("svg");
  var paths = svg.children("g").children("path");
  
  if (!reverseFlag) {
    element.css("background-color", RGBtoHEX(colorScheme[1]));
    paths.each((index, path) => {
      $(path).css("z-index", "11");
      $(path).attr("fill", RGBtoHEX(colorScheme[0]));
    });
    element.css("cursor", "pointer");
  } else {
    element.css("background-color", "transparent");
    paths.each((index, path) => {
      $(path).css("z-index", "11");
      $(path).attr("fill", RGBtoHEX(colorScheme[1]));
    });
    element.css("cursor", "default");
  }
}

function switchIconButton(element, colorsJSON) {
  /*
  Params:   element:          jQuery-object of the button's div, e.g. "$('#button')".
                              IMPORTANT: HTML of element needs to be structured like:
                              <div>...<svg>...<g>...<path>... with only ONE <g>! 
                              => Delete all multiple layers, i.e. multiple <g> before the <path>.
            colorsJSON:       colorsJSON from index page
  Flags:    -        
  Action:                     Switches the displayed SVG in the button
  Returns:  -     
  */
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
  // MAKE SURE THAT THERE ARE TWO SVGS INSIDE THE HTML ELEMENT
  var svgs = element.children("svg");
  var oldSvg = svgs.filter((index) => svgs[index].style.display == "block")[0];
  var newSvg = svgs.filter((index) => svgs[index].style.display == "none")[0];
  oldSvg.style.display = "none";
  newSvg.style.display = "block";
}

/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.hoverTextButton = hoverTextButton;
window.switchIconButton = switchIconButton;
*/
