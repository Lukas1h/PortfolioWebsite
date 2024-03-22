document.addEventListener('DOMContentLoaded', () => {

    setTimeout(()=>{
    const divs = document.querySelectorAll('.poloroid, .film');
    let delay = 0;
    
    divs.forEach((div, index) => {
      setTimeout(() => {
        div.classList.add('animated');
      }, delay);
      delay += 300; // Increase delay for next div; adjust time as needed
    });
    },600)
  });


//   background-image: linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff), linear-gradient(to right, #fff, #fff);
