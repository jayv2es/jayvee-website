/* -------------------------------------------------------------------------------
---------------------------- PAGE SWITCH FUNCTIONS -------------------------------
------------------------------------------------------------------------------- */
function changeSubmenuAnimation(
  oldClassNo,
  newClassNo,
  colorScheme,
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
  if (indexFlag && reverseFlag) {
    colorSchemeIndex = 0;
  }
  var amountToMove = window.innerWidth;
  // If reverse direction, negate amount to move.
  if (reverseFlag) {
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
            animTimeMove / 8,
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
          // Define flag to avoid loops in complete-callback
          // DEBUG measure: For some reason loops through the callback
          let enteredCallback = false;
          console.log("Check 1: " + enteredCallback);
          $(`.${oldClass}`).animate(
            {
              left: `-=${amountToMove}px`,
            },
            {
              duration: animTimeMove,
              easing: "swing",
              complete: () => {
                if (true) {
                  // Fade out and reposition old class
                  $(`.${oldClass}`).hide();
                  $(`.${oldClass}`).css("left", 0);
                  // 4. Fade in left/right arrows or explore arrow
                  // -------------------------------------------
                  if (indexFlag && reverseFlag && !enteredCallback) {
                    enteredCallback = true;
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
                          $("#explore").click(() => {
                            changeSubmenuAnimation(
                              0,
                              1,
                              colorScheme,
                              true,
                              false
                            );
                          });
                          // Set the right oldClassNo and newClassNo for reactivating, depending on direction
                          if (!reverseFlag) {
                            $(`#${oldClass}-arrowLeft-container`).click(() => {
                              changeSubmenuAnimation(
                                oldClassNo - 1,
                                oldClassNo,
                                colorScheme,
                                indexFlag,
                                true
                              );
                            });
                            $(`#${oldClass}-arrowRight-container`).click(() => {
                              changeSubmenuAnimation(
                                oldClassNo,
                                newClassNo,
                                colorScheme,
                                false,
                                false
                              );
                            });
                          } else {
                            $(`#${oldClass}-arrowLeft-container`).click(() => {
                              changeSubmenuAnimation(
                                oldClassNo,
                                newClassNo,
                                colorScheme,
                                indexFlag,
                                true
                              );
                            });
                            $(`#${oldClass}-arrowRight-container`).click(() => {
                              changeSubmenuAnimation(
                                newClassNo,
                                newClassNo + 1,
                                colorScheme,
                                false,
                                false
                              );
                            });
                          }
                        },
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
*/