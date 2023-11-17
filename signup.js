console.log("Hello from Sign Up");

const SignupForm = document.getElementById("sign-up");

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if (input.value.match(validRegex)) {
      return true; // Email is valid
    } else {
      //alert("Invalid email address!");
      input.focus();
      input.style.borderColor = "red";
      console.log("Input of this ",input);
      return false; // Email is invalid
    }
  }
  

  SignupForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("inside sign up");
  
    // Get the email input element
    const emailInput = document.getElementById("email");
  
    // Check if the email is valid using the ValidateEmail function
    if (!ValidateEmail(emailInput)) {
      return; // Do not proceed if the email is invalid
    }
  
    // If the email is valid, continue with the fetch request
    const formData = new FormData(SignupForm);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
      console.log(key, value);
    });
    console.log(formObject);
    console.log("Before fetch request");
  
    const response = await fetch('http://localhost:8000/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formObject)
    });
  
    console.log("Sign up Response", response);
  
    console.log("After fetch request");
  });
  

