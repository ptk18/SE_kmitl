console.log("login JS");
const loginForm = document.getElementById("login-form");
const errorMessageElement = document.getElementById("error-message");
const usr = localStorage.getItem('current-user');
console.log("current usr ", usr);

// Function to retrieve the username after successful login
async function getLoggedInUsername(email, password) {
  try {
    const response = await fetch(`http://localhost:8000/get-username/${email}`, {
      method: 'GET',  // Use GET method since you're retrieving data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userData = await response.json();
      const username = userData.username;
      console.log('Logged-in username:', username);
      localStorage.setItem('current-user', username);
      // You can use the username in your frontend as needed.
    } else {
      console.error('Failed to retrieve the username');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
    console.log(key, value);
  });
  console.log(formObject);

  console.log("Before fetch request");

  const response = await fetch('http://localhost:8000/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formObject),
  });

  console.log("login Response", response);

  console.log("After fetch request");

  if (response.ok) {
    // Get the logged-in username
    getLoggedInUsername(formObject.email, formObject.password);

    // Redirect to forum.html after successful login
    window.location.href = 'forum.html';
  } else {
    // Display an error message if login is unsuccessful
    errorMessageElement.textContent = "Incorrect email or password.\n Please try again.";
  }
});

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
