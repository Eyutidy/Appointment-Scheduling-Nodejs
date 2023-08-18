document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("updateForm");
  form.addEventListener("submitp", function (event) {
    event.preventDefault(); // Prevent form submission

    // Validate inputs
    var fullNameInput = document.getElementById("fullName");
    var emailInput = document.getElementById("email");

    var fullName = fullNameInput.value.trim();
    var email = emailInput.value.trim();

    if (fullName === "") {
      alert("Please enter your name.");
      return;
    }

    if (email === "") {
      alert("Please enter your email.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Create data object to send to the backend
    var data = {
      fullName: fullName,
      email: email,
    };

    // Send data to the backend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update"); // Replace with your backend endpoint
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        // Handle success response from the backend
        alert("Changes saved successfully.");
        // Perform any additional actions after successful update
      } else {
        // Handle error response from the backend
        alert("Error occurred while saving changes.");
      }
    };
    xhr.onerror = function () {
      // Handle network errors
      alert("Error occurred while saving changes.");
    };
    xhr.send(JSON.stringify(data));
  });

  function isValidEmail(email) {
    // Basic email validation regex
    var emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }
});
