const infos = document.querySelectorAll(".glasgow_info");

infos.forEach((glasgow_info) => {
  glasgow_info.addEventListener("click", () => {
    glasgow_info.classList.toggle("active")
  })
})
