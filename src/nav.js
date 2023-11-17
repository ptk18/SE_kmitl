function myFunction() {
  var x = document.getElementById("myTopnav");
  var buttons = document.querySelectorAll(".programBtn, .newsBtn");

  if (x.className === "topnav") {
    x.className += " responsive";
    buttons.forEach(function (button) {
      button.classList.remove("hidden");
    });
  } else {
    x.className = "topnav";
    buttons.forEach(function (button) {
      button.classList.add("hidden");
    });
  }
}

// JavaScript function to toggle the search input form
function toggleSearchForm() {
  var searchForm = document.querySelector(
    ".rightNavTabs .innerRightNavTabs .search-form"
  );
  var navLinks = document.querySelectorAll(
    ".rightNavTabs .innerRightNavTabs .nav-link"
  );

  // Toggle the display of the search form
  if (searchForm.style.display === "none" || searchForm.style.display === "") {
    searchForm.style.display = "block";

    // Hide the "Apply" and "FAQ" links
    navLinks.forEach(function (link) {
      link.classList.add("hiddenThem");
    });
  } else {
    searchForm.style.display = "none";

    // Show the "Apply" and "FAQ" links
    navLinks.forEach(function (link) {
      link.classList.remove("hiddenThem");
    });
  }
}

// Add a click event listener to the "Search" link
var searchLink = document.querySelector(
  '.rightNavTabs .innerRightNavTabs a[href="#search"]'
);
searchLink.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  toggleSearchForm(); // Toggle the search form visibility
});

// Add a click event listener to the "searchBtn"
var searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default button behavior
  toggleSearchForm(); // Toggle the search form visibility
});
