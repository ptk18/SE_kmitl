/*document.getElementById('submit').addEventListener('submit', function(event){
    event.preventDefault();
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    console.log(emailInput.value);
});*/
var submitBtn = document.getElementById('submit');
function submitForm(){
    
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    console.log("email", emailInput.value);
    console.log("password", passwordInput.value);
    var email = emailInput.value;
    var password = passwordInput.value;

    const data = {
        email: email,
        password: password
    };

    fetch("/fastapi-endpoint", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "Successful") {
          console.log("Authentication Successful");
        } else {
          console.log("Authentication Failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("ok");
}
submitBtn.addEventListener('click',submitForm);
console.log("hi")