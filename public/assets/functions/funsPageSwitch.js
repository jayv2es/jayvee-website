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
  if(reverseFlag) {
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
    $(`#${oldClass}-arrowLeft`).animate(
      {
        opacity: "-=0.1",
      },
      {
        duration: 500,
        easing: "swing",
        complete: () => {},
      }
    );
    $(`#${oldClass}-arrowRight`).animate(
      {
        opacity: "-=0.1",
      },
      {
        duration: 500,
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
  // Define amounts to move for contents and 1st/2nd part of logo anim
  var amountToMove_contents = window.innerWidth;
  var amountToMove_logo_1st = window.innerWidth*0.25;
  var amountToMove_logo_2nd = window.innerWidth*(0.25 + (2*1.389 + 1.5*9.56778)/100);
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
          console.log("Check 1: " + enteredCallback);
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
                  $('#logo').css("left", `${ parseInt($('#logo').css("left"))/window.innerWidth*100 }vw`);
                  $('#movingbar').css("left", `${ parseInt($('#movingbar').css("left"))/window.innerWidth*100 }vw`);
                  // -------------------------------------------
                  // Fade out and reposition old class
                  $(`.${oldClass}`).hide();
                  $(`.${oldClass}`).css("left", 0);
                  // 5. Fade in left/right arrows or explore arrow
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
                    if(!enteredCallback) {
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
                      // Play Lottie animation
                      if(reverse) {
                        // Switch class numbers for path-shortcut below to work
                        newClassNo = oldClassNo;
                      }
                      const svgAnim = bodymovin.loadAnimation({
                        path: `./../icons/anims/anim${newClassNo}.json`,
                        container: document.getElementById(/* Add container id */),
                        autoplay: true,
                        loop: false,
                        // further options -> https://lottiefiles.com/tutorials/how-to-add-lottie-animations-to-html-xYQ-HdVfBSA
                      })
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
*/