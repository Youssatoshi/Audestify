// Import and register all your controllers from the importmap under controllers/*

import { application } from "controllers/application"

// Eager load all controllers defined in the import map under controllers/**/*_controller
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"
eagerLoadControllersFrom("controllers", application)

// Lazy load controllers as they appear in the DOM (remember not to preload controllers in import map!)
// import { lazyLoadControllersFrom } from "@hotwired/stimulus-loading"
// lazyLoadControllersFrom("controllers", application)
const darkMode = document.querySelector('.dark-mode');

//darkMode.addEventListener('click', () => {
   // document.body.classList.toggle('dark-mode-variables');
    //darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    //darkMode.querySelector('span:nth-child(2)').classList.toggle('active');/
//});
