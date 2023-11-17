const faqs1 = document.querySelectorAll(".faq1");

faqs1.forEach((faq1) => {
  faq1.addEventListener("click", () => {
    faq1.classList.toggle("active");
  });
});

const faqs2 = document.querySelectorAll(".faq2");

faqs2.forEach((faq2) => {
  faq2.addEventListener("click", () => {
    faq2.classList.toggle("active");
  });
});
 

/*const faqs = document.querySelectorAll(".subjectFlex .question");

faqs.forEach((faq) => {
  faq.addEventListener("click", () => {
    // Toggle the active class only for the clicked question
    faq.parentElement.classList.toggle("active");

    // Close other answers
    faqs.forEach((otherFaq) => {
      if (otherFaq !== faq) {
        otherFaq.parentElement.classList.remove("active");
      }
    });
  });
});*/
