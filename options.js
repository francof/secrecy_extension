// Saves options to localStorage.
function save_options() {
  var pass = document.getElementById("default_pass").value;
  localStorage["default_pass"] = pass;
  var tag = document.getElementById("tag").value;
  localStorage["tag"] = tag;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var pass = localStorage["default_pass"];
  console.log("restoring");
  if (pass) {
  console.log("restoring");
    var passInput = document.getElementById("default_pass");
    passInput.value = pass;
  }
  var tag = localStorage["tag"];
  if (tag) {
  console.log("restoring");
    var tagInput = document.getElementById("tag");
    tagInput.value = tag;
  }
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
