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

function hoverMenupoint(elementNo, animTime, colorsJSON, reverseFlag = false) {
  /*  
    Params:   elementNo:    Number of menupoint to which logo should move (0=left, 3=right)
              animTime:     Duration of animation
              colorsJSON:   The colorsJSON file from index page
    Flags:    reverse:      If true, plays animation backwords (i.e. when mouseleave)
    Action:   Moves center of logo to center of chosen menupoint and changes color
    Returns:  - 
  */
  // Get element
  var colorScheme = window.loadColorTheme(colorsJSON, parseInt(window.getCookie("optionsColorscheme")));
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
