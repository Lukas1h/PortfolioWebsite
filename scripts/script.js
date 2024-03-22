document.addEventListener('DOMContentLoaded', () => {

    setTimeout(()=>{
    const divs = document.querySelectorAll('.poloroid');
    let delay = 0;
    
    divs.forEach((div, index) => {
      setTimeout(() => {
        div.classList.add('animated');
      }, delay);
      delay += 300; // Increase delay for next div; adjust time as needed
    });
    },600)
  });