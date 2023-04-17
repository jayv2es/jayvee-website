/* -------------------------------------------------------------------------------
---------------------------- PAGE SWITCH FUNCTIONS -------------------------------
------------------------------------------------------------------------------- */
function initializeLottieAnimation(classNo, colorScheme) {
  /*  
  Params:   classNo:          The (additional) class of ALL elements that belong to the menu/content that will be faded out
                              --> NEEDS TO BE SET-UP FOR ALL ELEMENTS IN THE HTML
                              --> Parameter: INTEGER (e.g. "0" for Grouped Class "GC0")
            colorScheme:      The in EJS selected/generated color scheme
  Flags:                      -
  Action:                     Initializes a lottie animation of a given GC in the desired color scheme
  Returns:                    -

          !!! IMPORTANT !!!
          -----------------
          In AE, the "Fill N" properties of each shape (dt. "Fläche N") needs to be renamed (press enter) into ".divAnimationFill".
          This CAN'T be done by simply adding a .cl = ".divAnimationFill" to the JS code (tried).
  */
  // Change colors of animation
  $(".divAnimationFill").css(
    "fill",
    `rgb(${colorScheme[1][0]},${colorScheme[1][1]},${colorScheme[1][2]})`
  );
  // Extract SVG from animation container
  var svgAnim = document.querySelector(`#GC${classNo}-animation svg`);
  if (svgAnim) {
    svgAnim.style.margin = "0";
    svgAnim.style.display = "flex";
    svgAnim.style.justifyContent = "left";
    svgAnim.style.transform = "translateX(-2%)";
    // Exctract grid height and aspect ratio of svg
    var aspectRatio =
      svgAnim.getAttribute("width") / svgAnim.getAttribute("height");
    var gridHeight = $(".grid-container")
      .css("grid-template-rows")
      .match(/[-+]?\d*\.*\d+/g)
      .map(parseFloat)[1];
    svgAnim.style.height = `${(gridHeight / window.innerHeight) * 100}vh`;
    svgAnim.style.width = `${
      ((gridHeight * aspectRatio) / window.innerWidth) * 100
    }vw`;
    // Recalculate on resize
    $(window).on("resize", () => {
      var aspectRatio =
        svgAnim.getAttribute("width") / svgAnim.getAttribute("height");
      var gridHeight = $(".grid-container")
        .css("grid-template-rows")
        .match(/[-+]?\d*\.*\d+/g)
        .map(parseFloat)[1];
      svgAnim.style.height = `${(gridHeight / window.innerHeight) * 100}vh`;
      svgAnim.style.width = `${
        ((gridHeight * aspectRatio) / window.innerWidth) * 100
      }vw`;
    });
  }
}

function changeSubmenuAnimation(
  oldClassNo,
  newClassNo,
  colorScheme,
  anims,
  indexFlag,
  reverseFlag = false
) {
  /*
  Params:   oldClassNo:         The (additional) class of ALL elements that belong to the menu/content that will be faded out
                              --> NEEDS TO BE SET-UP FOR ALL ELEMENTS IN THE HTML
                              --> Parameter: INTEGER (e.g. "0" for Grouped Class "GC0")
            newClassNo:         The (additional) class of ALL elements that belong to the menu/content that will be faded in
                              --> NEEDS TO BE SET-UP FOR ALL ELEMENTS IN THE HTML
                              --> Parameter: INTEGER (e.g. "1" for Grouped Class "GC1")
            colorScheme:      The in EJS selected/generated color scheme
            anims:            Array of the lottie animation objects, i.e. [lottieAnim1, ..., lottieAnim4]
  Flags:    indexFlag:        If true, adapts animation for the transition INDEX -> SUBMENU (or vice versa if reverseFlag = true)
            reverseFlag:   If false:   Anim direction: Left -> Right
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
  // Stop menu from being interactable
  $(".h2menu").off("mouseenter mouseleave click");
  // Deactivate arrow buttons once clicked
  if (reverseFlag) {
    $(`#${newClass}-arrowLeft-container`).off("click");
    $(`#${newClass}-arrowRight-container`).off("click");
  } else {
    $(`#${oldClass}-arrowLeft-container`).off("click");
    $(`#${oldClass}-arrowRight-container`).off("click");
  }
  // 0. Fade out explore button (if index) or arrow buttons (if other)
  if (reverseFlag) {
    // Change classes if reverse direction
    var tempClass = oldClass;
    oldClass = newClass;
    newClass = tempClass;
  }
  if (indexFlag && !reverseFlag) {
    $(".explore").off("click");
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
    // Fade out arrows
    $(`#${oldClass}-arrowLeft`).animate(
      {
        opacity: "-=0.1",
      },
      {
        duration: animTimeLogo / 4,
        easing: "swing",
        complete: () => {},
      }
    );
    $(`#${oldClass}-arrowRight`).animate(
      {
        opacity: "-=0.1",
      },
      {
        duration: animTimeLogo / 4,
        easing: "swing",
        complete: () => {},
      }
    );
    // Fade out current content before playing animation
    $(`.${oldClass}`).animate(
      {
        opacity: "-=1",
      },
      {
        duration: animTimeLogo / 3,
        easing: "swing",
        complete: () => {},
      }
    );
  }

  // 1. Move logo out of screen
  // -------------------------------------------
  var colorSchemeIndex = newClassNo + 1; // Get color of subdivision for background
  if (reverseFlag) {
    colorSchemeIndex = oldClassNo + 1;
  }
  // Set color to standard background color if going back to index page
  if (indexFlag && reverseFlag) {
    colorSchemeIndex = 0;
  }
  // Define amounts to move for contents and 1st/2nd part of logo anim
  // First for index animation
  var amountToMove_contents = window.innerWidth;
  var amountToMove_logo_1st = window.innerWidth * 0.25;
  var amountToMove_logo_2nd =
    window.innerWidth * (0.25 + (2 * 1.389 + 1.5 * 9.56778) / 100);
  // If not index animation, use different values
  if (!indexFlag) {
    amountToMove_contents = window.innerWidth;
    amountToMove_logo_1st =
      window.innerWidth * (0.25 + (2 * 1.389 + 1.5 * 9.56778) / 100);
    amountToMove_logo_2nd =
      window.innerWidth * (0.25 + (2 * 1.389 + 1.5 * 9.56778) / 100);
  }
  // If reverse direction, negate amount to move.
  if (reverseFlag) {
    amountToMove_contents = -amountToMove_contents;
    amountToMove_logo_1st = -amountToMove_logo_1st;
    amountToMove_logo_2nd = -amountToMove_logo_2nd;
  }
  // Animation
  $("#logo").animate(
    {
      left: `+=${amountToMove_logo_1st}px`,
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
      left: `+=${amountToMove_logo_1st}px`,
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
            animTimeMove / 8,
            $("html"),
            "background-color",
            false
          );
          firstProgRead = false; // Progress has been read once above 0.5
          $(`.${newClass}`).css("position", "relative");
          $(`.${newClass}`).animate(
            {
              left: `+=${amountToMove_contents}px`,
            },
            {
              duration: 0,
            }
          );
          // Reset opacity of arrows
          if (!(indexFlag && reverseFlag)) {
            $(`#${newClass}-arrowLeft`).animate(
              {
                opacity: "-=0.1",
              },
              {
                duration: 0,
              }
            );
            $(`#${newClass}-arrowRight`).animate(
              {
                opacity: "-=0.1",
              },
              {
                duration: 0,
              }
            );
          }
          // Set opacity of content to zero if reverse and not index
          if (!indexFlag) {
            if (reverseFlag) {
              console.log("Resetting opacity of " + newClass);
              $(`.${newClass}`).css("opacity", "0");
            } else {
              $(`.${newClass}`).css("opacity", "1");
            }
          }
          // ...except for explore-Button if necessary.
          if (indexFlag && reverseFlag) {
            $(`.explore`).animate(
              {
                opacity: "-=1",
              },
              {
                duration: 0,
              }
            );
          }
          $(`.${newClass}`).show();
          // 3. Move content to the opposite side along with logo,
          //    so it looks like the observer moves to the right
          // -------------------------------------------
          $("#logo").animate(
            {
              left: `-=${amountToMove_logo_2nd}px`,
            },
            {
              duration: animTimeMove * 0.75,
              easing: "swing",
              complete: () => {},
            }
          );
          $("#movingbar").animate(
            {
              left: `-=${amountToMove_logo_2nd}px`,
            },
            {
              duration: animTimeMove * 0.75,
              easing: "swing",
              complete: () => {},
            }
          );
          $(`.${newClass}`).animate(
            {
              left: `-=${amountToMove_contents}px`,
            },
            {
              duration: animTimeMove,
              easing: "swing",
              complete: () => {},
            }
          );
          // Define flag to avoid loops in complete-callback
          // DEBUG measure: For some reason loops through the callback
          let enteredCallback = false;
          $(`.${oldClass}`).animate(
            {
              left: `-=${amountToMove_contents}px`,
            },
            {
              duration: animTimeMove,
              easing: "swing",
              complete: () => {
                if (true) {
                  // 4. Once finished, fix the logo in terms of vw at this point so it scales correctly when resizing
                  $("#logo").css(
                    "left",
                    `${
                      (parseInt($("#logo").css("left")) / window.innerWidth) *
                      100
                    }vw`
                  );
                  $("#movingbar").css(
                    "left",
                    `${
                      (parseInt($("#movingbar").css("left")) /
                        window.innerWidth) *
                      100
                    }vw`
                  );
                  // -------------------------------------------
                  // Fade out and reposition old class
                  $(`.${oldClass}`).hide();
                  $(`.${oldClass}`).css("left", 0);
                  // Reset animation
                  if (!reverseFlag) {
                    if (!indexFlag) {
                      anims[oldClassNo - 1].goToAndStop(0, true);
                    }
                  } else {
                    anims[newClassNo - 1].goToAndStop(0, true);
                  }
                  // 5. Fade in left/right arrows or explore arrow and play animation
                  // -------------------------------------------
                  if (indexFlag && reverseFlag && !enteredCallback) {
                    enteredCallback = true;
                    // Fade in arrows
                    $(".explore").animate(
                      {
                        opacity: "+=1",
                      },
                      {
                        duration: 500,
                        easing: "swing",
                        complete: () => {
                          // Reenable menu interactions
                          $("#h2menu0").on("mouseenter", () => {
                            hoverMenupoint(
                              0,
                              500,
                              colorScheme,
                              (reverseFlag = false)
                            );
                          });
                          $("#h2menu0").on("click", () => {
                            // Click interaction code HERE
                          });
                          $("#h2menu0").on("mouseleave", () => {
                            hoverMenupoint(
                              0,
                              500,
                              colorScheme,
                              (reverseFlag = true)
                            );
                          });
                          $("#h2menu1").on("mouseenter", () => {
                            hoverMenupoint(
                              1,
                              500,
                              colorScheme,
                              (reverseFlag = false)
                            );
                          });
                          $("#h2menu1").on("click", () => {
                            // Click interaction code HERE
                          });
                          $("#h2menu1").on("mouseleave", () => {
                            hoverMenupoint(
                              1,
                              500,
                              colorScheme,
                              (reverseFlag = true)
                            );
                          });
                          $("#h2menu2").on("mouseenter", () => {
                            hoverMenupoint(
                              2,
                              500,
                              colorScheme,
                              (reverseFlag = false)
                            );
                          });
                          $("#h2menu2").on("click", () => {
                            // Click interaction code HERE
                          });
                          $("#h2menu2").on("mouseleave", () => {
                            hoverMenupoint(
                              2,
                              500,
                              colorScheme,
                              (reverseFlag = true)
                            );
                          });
                          $("#h2menu3").on("mouseenter", () => {
                            hoverMenupoint(
                              3,
                              500,
                              colorScheme,
                              (reverseFlag = false)
                            );
                          });
                          $("#h2menu3").on("click", () => {
                            // Click interaction code HERE
                          });
                          $("#h2menu3").on("mouseleave", () => {
                            hoverMenupoint(
                              3,
                              500,
                              colorScheme,
                              (reverseFlag = true)
                            );
                          });
                          console.log("Initialize explore.");
                          $("#explore").on("click", () => {
                            changeSubmenuAnimation(
                              0,
                              1,
                              colorScheme,
                              anims,
                              true,
                              false
                            );
                          });
                        },
                      }
                    );
                  } else {
                    if (!enteredCallback) {
                      enteredCallback = true;
                      // Set the right oldClassNo and newClassNo for reactivating, depending on direction
                      if (!reverseFlag) {
                        // Play animation
                        anims[newClassNo - 1].play();
                        console.log(
                          "Initialize arrows: oldClassNo = " +
                            oldClassNo +
                            ", newClassNo = " +
                            newClassNo
                        );
                        console.log(
                          "Initialize arrows: oldClass = " +
                            oldClass +
                            ", newClass = " +
                            newClass
                        );
                        $(`#${newClass}-arrowLeft-container`).on(
                          "click",
                          () => {
                            console.log("Arrow left clicked");
                            changeSubmenuAnimation(
                              oldClassNo,
                              oldClassNo + 1,
                              colorScheme,
                              anims,
                              indexFlag,
                              true
                            );
                          }
                        );
                        $(`#${newClass}-arrowRight-container`).on(
                          "click",
                          () => {
                            changeSubmenuAnimation(
                              oldClassNo + 1,
                              newClassNo + 1,
                              colorScheme,
                              anims,
                              false,
                              false
                            );
                          }
                        );
                      } else {
                        // If new class is 1st page && reverse==true, set indexFlag to true
                        if (newClass == "GC1") {
                          indexFlag = true;
                        }
                        // Reset opacity of content (fade in)
                        if (!indexFlag) {
                          console.log("Resetting opacity to 1 of " + newClass);
                          $(`.${newClass}`).animate(
                            {
                              opacity: "+=1",
                            },
                            {
                              duration: 500,
                            }
                          );
                        }
                        console.log(
                          "Initialize reverse: oldClassNo = " +
                            oldClassNo +
                            ", newClassNo = " +
                            newClassNo
                        );
                        console.log(
                          "Initialize reverse: oldClass = " +
                            oldClass +
                            ", newClass = " +
                            newClass
                        );
                        if (oldClassNo != 0) {
                          // Only play anim if not switched to index page
                          anims[oldClassNo - 1].play();
                        }
                        $(`#${newClass}-arrowLeft-container`).on(
                          "click",
                          () => {
                            changeSubmenuAnimation(
                              oldClassNo - 1,
                              oldClassNo,
                              colorScheme,
                              anims,
                              indexFlag,
                              true
                            );
                          }
                        );
                        $(`#${newClass}-arrowRight-container`).on(
                          "click",
                          () => {
                            changeSubmenuAnimation(
                              oldClassNo,
                              newClassNo,
                              colorScheme,
                              anims,
                              false,
                              false
                            );
                          }
                        );
                      }
                      $(`#${newClass}-arrowLeft`).animate(
                        {
                          opacity: "+=0.1",
                        },
                        {
                          duration: 500,
                          easing: "swing",
                          complete: () => {},
                        }
                      );
                      $(`#${newClass}-arrowRight`).animate(
                        {
                          opacity: "+=0.1",
                        },
                        {
                          duration: 500,
                          easing: "swing",
                          complete: () => {},
                        }
                      );
                    }
                  }
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
window.changeSubmenuAnimation = changeSubmenuAnimation;
window.initializeLottieAnimation = initializeLottieAnimation;
*/
