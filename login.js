console.log("login JS")
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
                console.log(key,value);
            });
            console.log(formObject);

            console.log("Before fetch request"); 

            const response = await fetch('http://localhost:8000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });    
            console.log("login Response", response);
            
            console.log("After fetch request");
        });

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}