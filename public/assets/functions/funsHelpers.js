/* -------------------------------------------------------------------------------
 ------------------------------- HELPER FUNCTIONS --------------------------------
 ------------------------------------------------------------------------------- */
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



/* -------------------------------------------------------------------------------
------------------------------------ EXPORT --------------------------------------
------------------------------------------------------------------------------- */
/*
window.isoStringToDate = isoStringToDate;
window.writeFileCallback = writeFileCallback;
window.setCookie = setCookie;
window.getCookie = getCookie;
*/