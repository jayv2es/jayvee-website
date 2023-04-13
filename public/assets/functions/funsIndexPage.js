/* -------------------------------------------------------------------------------
----------------------------- INDEX PAGE FUNCTIONS -------------------------------
------------------------------------------------------------------------------- */
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



/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.firstLoadIndexAnimation = firstLoadIndexAnimation;
window.clickThemeChange = clickThemeChange;
window.hoverMenupoint = hoverMenupoint;
*/
