/* -------------------------------------------------------------------------------
--------------------------- SELECTION BOX FUNCTIONS ------------------------------
------------------------------------------------------------------------------- */
const { css } = require("jquery");

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
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
window.expandSelectionBox = expandSelectionBox;
window.contractSelectionBox = contractSelectionBox;
window.resetSelectionBox = resetSelectionBox;
