document.addEventListener("turbo:load", function() {
  const darkMode = document.querySelector('.dark-mode');

  // Ensure we're not adding multiple listeners after each turbo:load event
  if (darkMode.getAttribute("listener") !== "true") {
    darkMode.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode-variables');
      darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
      darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
    });

    darkMode.setAttribute("listener", "true");
  }
});
