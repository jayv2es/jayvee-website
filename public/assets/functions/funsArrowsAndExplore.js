/* -------------------------------------------------------------------------------
------------------------------- ARROWS + EXPLORE ---------------------------------
------------------------------------------------------------------------------- */

function hoverExplore(
  animTime,
  colorsJSON,
  initialFontWeight,
  initialStrokeWidth,
  reverseFlag = false
) {
  /*  
    Params:   animTime:             Duration of animation
              colorsJSON:           colorsJSON from index page
              initialFontWeight:    Current font-weight (const), extracted in EJS code before calling the function.
              initialStrokeWidth:   Current stroke-width (const), extracted in EJS code before calling the function.
    Flags:    reverse:              If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves "START TOUR" button 1vh to the right and displays bold and clickable, reverses if flag true.
    Returns:  - 
  */
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
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
  colorsJSON,
  initialStrokeWidth,
  arrowDirection,
  reverseFlag = false
) {
  /*  
    Params:   animTime:             Duration of animation
              colorsJSON:           ColorsJSON from index page
              initialStrokeWidth:   Current stroke-width (const), extracted in EJS code before calling the function.
              arrowDirection:       "Left" or "Right", depending on which side arrow
    Flags:    reverse:              If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves "arrows 1vh to the left/right (dep. on arrowDirection) and displays bold and clickable, reverses if flag true.
    Returns:  - 
  */
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
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

/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.hoverExplore = hoverExplore;
window.hoverArrow = hoverArrow;
*/