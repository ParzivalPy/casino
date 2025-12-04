function deckCreation(deck_num) {
  let deck = [];
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  for (let i = 0; i < deck_num; i++) {
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ suit: suit, value: value });
      }
    }
  }
  return deck;
}

function drawRandomCard(deck) {
  if (deck.length === 0) {
    throw new Error("No cards left in the deck");
  }
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck.splice(randomIndex, 1)[0];
}

function countCardsInHand(hand) {
  let base = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === "J" || card.value === "Q" || card.value === "K") {
      base += 10;
    } else if (card.value === "A") {
      aces += 1;
      base += 1;
    } else {
      base += parseInt(card.value);
    }
  }

  let best = base;
  for (let i = 1; i <= aces; i++) {
    const candidate = base + i * 10;
    if (candidate <= 21) best = candidate;
    else break;
  }

  return best;
}

function formatHandScore(hand) {
  let sum = 0;
  let aces = 0;
  for (let card of hand) {
    if (card.value === "J" || card.value === "Q" || card.value === "K") {
      sum += 10;
    } else if (card.value === "A") {
      aces += 1;
      sum += 1;
    } else {
      sum += parseInt(card.value);
    }
  }

  if (aces === 0) return String(sum);

  let maxCandidate = sum;
  for (let i = 1; i <= aces; i++) {
    const candidate = sum + i * 10;
    if (candidate <= 21) maxCandidate = candidate;
    else break;
  }

  if (maxCandidate > sum) {
    return `${sum}/${maxCandidate}`;
  }

  return String(sum);
}

function draw(deck, hand) {
  if (deck.length === 0) {
    throw new Error("No cards left in the deck");
  }
  const card = drawRandomCard(deck);
  hand.push(card);
  return card;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function revealFaceDowns(handContainer) {
  if (!handContainer) return;
  const turnedCards = handContainer.querySelectorAll('.game-card');
  turnedCards.forEach((gc) => {
    gc.classList.add('turned');
    const recto = gc.querySelector('.recto');
    const verso = gc.querySelector('.verso');
    if (recto) recto.style.zIndex = '1';
    if (verso) verso.style.zIndex = '2';
  });
}

function renderCard(card, handContainer, facedown = false) {
  if (!handContainer) return null;

  const container = document.createElement("div");
  container.className = "game-card-container incoming";

  const gameCard = document.createElement("div");
  gameCard.className = "game-card" + (facedown ? "" : " turned");

  const recto = document.createElement("div");
  recto.className = "recto";

  const verso = document.createElement("div");
  verso.className = "verso";

  const number = document.createElement("div");
  number.className = "number";
  number.innerText = card.value;

  const suit = document.createElement("div");
  suit.className = "suit";
  const suitMap = { Hearts: "♥", Diamonds: "♦", Clubs: "♣", Spades: "♠" };
  suit.innerText = suitMap[card.suit] || card.suit;
  if (card.suit === "Hearts" || card.suit === "Diamonds") {
    suit.classList.add("red-suit");
  }

  const suitWrapper = document.createElement("div");
  suitWrapper.className = "suit";
  suitWrapper.appendChild(suit);

  verso.appendChild(number);
  verso.appendChild(suitWrapper);

  gameCard.appendChild(recto);
  gameCard.appendChild(verso);
  container.appendChild(gameCard);

  if (facedown) {
    recto.style.zIndex = "2";
    verso.style.zIndex = "1";
  } else {
    recto.style.zIndex = "1";
    verso.style.zIndex = "2";
  }

  handContainer.appendChild(container);

  requestAnimationFrame(() => {
    container.classList.remove("incoming");
    container.classList.add("sliding");
    setTimeout(() => container.classList.remove("sliding"), 650);
  });

  return container;
}

function printHand(hand, who) {
  console.log(`${who}'s hand:`, hand);
  let score = countCardsInHand(hand);
  console.log("Count of cards in hand:", score);
  return score;
}

function playerTurnDraw(deck, hand, can_play, score) {
  const card = draw(deck, hand);
  const total = countCardsInHand(hand);
  score = printHand(hand);

  if (total > 21) {
    console.log("Bust! Player exceeded 21 points.");
    end_turn = true;
  }
}

function playerTurn(deck, onPlayerEnd, player_hand, dealer_hand, onInitialDeal) {
  let can_play = true;

  const playerHandContainer = document.getElementById("player-hand");
  const dealerHandContainer = document.getElementById("dealer-hand");

  for (let i = 0; i < 2; i++) {
    const card = draw(deck, player_hand);
    renderCard(card, playerHandContainer, false);
  }

  const dealerCard = draw(deck, dealer_hand);
  renderCard(dealerCard, dealerHandContainer, true);

  let score = countCardsInHand(dealer_hand);
  document.getElementById("dealer-score").innerText = formatHandScore(dealer_hand);
  score = countCardsInHand(player_hand);
  document.getElementById("player-score").innerText = formatHandScore(player_hand);
  printHand(player_hand);

  if (typeof onInitialDeal === "function") {
    const handled = onInitialDeal(player_hand, dealer_hand);
    if (handled) {
      can_play = false;
      return;
    }
  }

  function drawCard() {
    if (can_play) {
      const card = draw(deck, player_hand);
      renderCard(card, document.getElementById("player-hand"), false);
      const score = countCardsInHand(player_hand);
      document.getElementById("player-score").innerText = formatHandScore(player_hand);
      printHand(player_hand);

      if (score >= 21) {
        endTurn();
      }
    }
  }

  function endTurn() {
    can_play = false;
    document.getElementById("draw").removeEventListener("click", drawCard);
    document.getElementById("stay").removeEventListener("click", endTurn);
    console.log("Player's final hand:", player_hand);
    console.log("Final count of cards in hand:", countCardsInHand(player_hand));

    if (typeof onPlayerEnd === "function") {
      onPlayerEnd();
    }
  }

  document.getElementById("draw").addEventListener("click", drawCard);
  document.getElementById("stay").addEventListener("click", endTurn);
}

function dealerTurn(deck, dealer_hand) {
  let can_play = true;

  const dealerHandContainer = document.getElementById("dealer-hand");

  const facedownGameCard = dealerHandContainer.querySelector('.game-card.turned');
  if (facedownGameCard) {
    facedownGameCard.classList.remove('turned');
    const rectoEl = facedownGameCard.querySelector('.recto');
    const versoEl = facedownGameCard.querySelector('.verso');
    if (rectoEl && versoEl) {
      rectoEl.style.zIndex = "2";
      versoEl.style.zIndex = "1";
    }
  }

  const firstCard = draw(deck, dealer_hand);
  renderCard(firstCard, dealerHandContainer, false);
  printHand(dealer_hand);
  document.getElementById("dealer-score").innerText = formatHandScore(dealer_hand);

  while (can_play) {
    const score = countCardsInHand(dealer_hand);
    document.getElementById("dealer-score").innerText = formatHandScore(dealer_hand);
    if (score < 17) {
      const c = draw(deck, dealer_hand);
      renderCard(c, dealerHandContainer, false);
      printHand(dealer_hand);
      await sleep(600);
    } else if (score > 21) {
      console.log("Dealer busts! Dealer exceeded 21 points.");
      can_play = false;
    } else {
      console.log("Dealer stays.");
      can_play = false;
    }
  }

  console.log("Dealer's final hand:", dealer_hand);
  console.log("Final count of cards in hand:", countCardsInHand(dealer_hand));
}

function checkWinner(playerScore, dealerScore, credits, bet) {
  let newCredits = credits;
  if (playerScore > 21) {
    changeCredsBet(0, newCredits);
    return { message: "Dealer wins! Player busted.", credits: newCredits };
  } else if (dealerScore > 21) {
    newCredits = newCredits + 2 * bet;
    changeCredsBet(0, newCredits);
    return { message: "Player wins! Dealer busted.", credits: newCredits };
  } else if (playerScore > dealerScore) {
    newCredits = newCredits + 2 * bet;
    changeCredsBet(0, newCredits);
    return { message: "Player wins!", credits: newCredits };
  } else if (dealerScore > playerScore) {
    changeCredsBet(0, newCredits);
    return { message: "Dealer wins!", credits: newCredits };
  } else {
    newCredits += bet;
    changeCredsBet(0, newCredits);
    return { message: "It's a tie!", credits: newCredits };
  }
}

function manageCredits(credits, bet) {
  console.log(`You currently have ${credits} credits.`);
  while (true) {
    const input = prompt("Enter your bet amount: ");
    if (input === null) {
      continue;
    }
    const parsed = Number(input);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      alert("Please enter a positive whole number for your bet.");
      continue;
    }
    if (parsed > credits) {
      alert("Not enough credits to place this bet.");
      continue;
    }
    bet = parsed;
    const remaining = credits - bet;
    console.log(`Bet placed: ${bet}. Remaining credits: ${remaining}`);
    return bet;
  }
}

function changeCredsBet(bet, credits) {
  document.getElementById("bet").innerText = bet;
  document.getElementById("credits").innerText = credits;
}

function speech(sentence) {
  let text = new SpeechSynthesisUtterance(sentence);

  text.lang = "en";
  text.rate = 0.7;
  text.pitch = 1;

  window.speechSynthesis.speak(text);
}

function resetGame() {
  document.getElementById("player-score").innerText = "0";
  document.getElementById("dealer-score").innerText = "0";

  document.getElementById("bet").innerText = "0";
  const playerHandContainer = document.getElementById("player-hand");
  const dealerHandContainer = document.getElementById("dealer-hand");
  if (playerHandContainer) playerHandContainer.innerHTML = "";
  if (dealerHandContainer) dealerHandContainer.innerHTML = "";

  document.getElementById("new-round").style.display = "none";

  document.getElementById("draw").style.display = "inline-block";
  document.getElementById("stay").style.display = "inline-block";
  document.getElementById("split").style.display = "inline-block";
  document.getElementById("double").style.display = "inline-block";

  console.log("Game reset for new round");
}

function endGame() {
  document.getElementById("draw").style.display = "none";
  document.getElementById("stay").style.display = "none";
  document.getElementById("split").style.display = "none";
  document.getElementById("double").style.display = "none";

  document.getElementById("new-round").style.display = "inline-block";
}

function checkAndRefillDeck(deck) {
  if (deck.length < 10) {
    console.log("Deck running low, creating new deck...");
    const newDeck = deckCreation(5);
    deck.push(...newDeck);
    console.log(`Deck refilled. New deck size: ${deck.length}`);
  }
}

function main(credits, deck) {
  checkAndRefillDeck(deck);

  const player_hand = [];
  const dealer_hand = [];

  let bet = 0;
  bet = manageCredits(credits, bet);
  credits -= bet;
  changeCredsBet(bet, credits);

  playerTurn(
    deck,
    () => {
      dealerTurn(deck, dealer_hand);

      const playerHandContainer = document.getElementById('player-hand');
      const dealerHandContainer = document.getElementById('dealer-hand');
      revealFaceDowns(playerHandContainer);
      revealFaceDowns(dealerHandContainer);

      const playerScore = countCardsInHand(player_hand);
      const dealerScore = countCardsInHand(dealer_hand);

      const result = checkWinner(playerScore, dealerScore, credits, bet);
      console.log(result.message);
      speech(result.message);

      credits = result.credits;

      endGame();

      const newRoundBtn = document.getElementById("new-round");
      newRoundBtn.onclick = function () {
        if (credits <= 0) {
          alert("Game Over! You have no more credits.");
          location.reload();
          return;
        }

        resetGame();

        player_hand.length = 0;
        dealer_hand.length = 0;

        setTimeout(() => {
          main(credits, deck);
        }, 100);
      };
    },
    player_hand,
    dealer_hand,
    (pHand, dHand) => {
      const playerBJ = pHand.length === 2 && countCardsInHand(pHand) === 21;
      const dealerBJ = dHand.length === 2 && countCardsInHand(dHand) === 21;

      if (playerBJ || dealerBJ) {
        if (playerBJ && !dealerBJ) {
          credits = credits + 3 * bet;
          changeCredsBet(0, credits);
          const msg = `Blackjack! Player wins ${3 * bet} credits.`;
          console.log(msg);
          speech(msg);
        } else if (dealerBJ && !playerBJ) {
          changeCredsBet(0, credits);
          const msg = `Dealer has blackjack. Dealer wins.`;
          console.log(msg);
          speech(msg);
        } else {
          credits += bet;
          changeCredsBet(0, credits);
          const msg = `Both have blackjack. It's a tie.`;
          console.log(msg);
          speech(msg);
        }

        endGame();

        const newRoundBtn = document.getElementById("new-round");
        newRoundBtn.onclick = function () {
          if (credits <= 0) {
            alert("Game Over! You have no more credits.");
            location.reload();
            return;
          }
          resetGame();
          pHand.length = 0;
          dHand.length = 0;
          setTimeout(() => main(credits, deck), 100);
        };

        return true;
      }

      return false;
    }
  );
}

const startButton = document.getElementById("start-game");
startButton.addEventListener("click", () => {
  document.getElementById("starter-box").remove();
  document.getElementById("starter-box-blur").remove();
  setTimeout(() => {
    const deck = deckCreation(5);
    let credits = 1000;
    main(credits, deck);
  }, 500);
});
