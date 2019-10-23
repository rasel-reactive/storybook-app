
//. Show Password Field
let parentInputs = document.querySelectorAll(".input");
for (let parentInput of parentInputs) {
  let eyeIcon = parentInput.querySelectorAll(".show-password");
  eyeIcon[0].addEventListener("click", function(e) {
    let input = e.target.parentElement.querySelector(".password");
    if (e.target.classList.contains("fa-eye")) {
      e.target.className = " show-password fa fa-eye-slash";
      input.setAttribute("type", "text");
    } else {
      e.target.className = "show-password fa fa-eye";
      input.setAttribute("type", "password");
    }
  });
}


//. Flash Message Hidden
let flash = document.querySelector(".flash");
if (flash && flash.classList.contains("flash-show")) {
  setTimeout(() => {
    flash.classList.remove("flash-show");
  }, 5000);

  setTimeout(() => {
    flash.style.overflow = "hidden";
    flash.style.height = "0px";
    flash.style.fontSize = "0";
  }, 6000);
}




//. Side Bar Show
let sideNav = document.querySelector('.side-nav')
let menuIcon = document.querySelector('.menu-icon')
let backdrop = document.querySelector('.backdrop')
let containers = document.querySelectorAll('.container')

menuIcon.addEventListener('click', function(){
  backdrop.classList.add('show-backdrop')
  sideNav.classList.add('show-sidebar')

  containers.forEach(container=>{
    container.classList.add('add-blur')
  })
})

//. Control Backdrop
backdrop.addEventListener('click', function(e){

  backdrop.classList.remove('show-backdrop')
  backdrop.classList.add('hide-backdrop')
  
  sideNav.classList.remove('show-sidebar')
  sideNav.classList.add('hide-side-nav')

  containers.forEach(container=>{
    container.classList.remove('add-blur')
  })
})
