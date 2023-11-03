console.log("Hello from Sign Up");

const SignupForm = document.getElementById("sign-up");

SignupForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            console.log("inside sign up")

            const formData = new FormData(SignupForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
                console.log(key,value);
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


