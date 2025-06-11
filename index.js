// Change the index of .verso to pull it up during the flip animation

const card = document.querySelector(".game-card");
const verso = document.querySelector(".verso");
card.addEventListener("transitionstart", () => {
  if (verso.style.zIndex == "3") {
    setTimeout(() => {
      verso.style.zIndex = 1;
    }, 300);
  } else {
    setTimeout(() => {
      verso.style.zIndex = 3;
    }, 300);
  }
});

card.addEventListener("mouseleave", () => {
  verso.style.zIndex = 3;
});
