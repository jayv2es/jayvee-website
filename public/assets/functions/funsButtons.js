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
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.hoverButton = hoverButton;
*/