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
    "Jack",
    "Queen",
    "King",
    "Ace",
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
  return deck.splice(randomIndex, 1)[0]; // Correctly removes and returns the card
}

function countCardsInHand(hand) {
  let count = 0;
  for (let card of hand) {
    if (
      card.value === "Jack" ||
      card.value === "Queen" ||
      card.value === "King"
    ) {
      count += 10;
    } else if (card.value === "Ace") {
      count += count + 11 > 21 ? 1 : 11;
    } else {
      count += parseInt(card.value);
    }
  }
  return count;
}

function draw(deck, hand) {
  if (deck.length === 0) {
    throw new Error("No cards left in the deck");
  }
  const card = drawRandomCard(deck);
  hand.push(card);
  return card;
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
    end_turn = true; // End the turn if the player exceeds 21
  }
}

function playerTurn(deck, onPlayerEnd, player_hand) {
  let can_play = true;

  // Initial draw sequence: player, dealer, player
  player_hand.push(drawRandomCard(deck)); // 1ère carte joueur
  window.dealer_hand = window.dealer_hand || [];
  window.dealer_hand.push(drawRandomCard(deck)); // 1ère carte dealer
  player_hand.push(drawRandomCard(deck)); // 2ème carte joueur
  const score = countCardsInHand(player_hand);
  document.getElementById("player-score").innerText = score;
  printHand(player_hand);

  // Callback functions for event listeners
  function drawCard() {
    if (can_play) {
      const card = draw(deck, player_hand);
      const score = countCardsInHand(player_hand);
      document.getElementById("player-score").innerText = score;
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

    // Call the callback to transition to dealerTurn
    if (typeof onPlayerEnd === "function") {
      onPlayerEnd();
    }
  }

  // Add event listeners
  document.getElementById("draw").addEventListener("click", drawCard);
  document.getElementById("stay").addEventListener("click", endTurn);
}

function dealerTurn(deck, dealer_hand) {
  let can_play = true;

  // Initial draw for the dealer
  for (let i = 0; i < 2; i++) {
    dealer_hand.push(drawRandomCard(deck));
  }
  printHand(dealer_hand);

  while (can_play) {
    const score = countCardsInHand(dealer_hand);
    document.getElementById("dealer-score").innerText = score;
    if (score < 17) {
      draw(deck, dealer_hand);
      printHand(dealer_hand);
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
    return { message: `Player wins! Dealer busted.`, credits: newCredits };
  } else if (playerScore > dealerScore) {
    newCredits = newCredits + 2 * bet;
    changeCredsBet(0, newCredits);
    return { message: `Player wins!`, credits: newCredits };
  } else if (dealerScore > playerScore) {
    changeCredsBet(0, newCredits);
    return { message: "Dealer wins!", credits: newCredits };
  } else {
    newCredits += bet; // Return the bet to the player in case of a tie
    changeCredsBet(0, newCredits);
    return { message: `It's a tie!`, credits: newCredits };
  }
}

function manageCredits(credits, bet) {
  console.log(`You currently have ${credits} credits.`);
  bet = parseInt(prompt("Enter your bet amount: "), 10);
  if (bet > credits) {
    console.log("Not enough credits to place this bet.");
    return credits; // Return unchanged credits
  }
  credits -= bet;
  console.log(`Bet placed: ${bet}. Remaining credits: ${credits}`);
  return bet;
}

const card = document.querySelectorAll(".game-card");
card.forEach((c) => {
  c.addEventListener("transitionstart", () => {
    setTimeout(() => {
      c.lastChild.style.zIndex = 3;
    }, 300);
  });
});

function changeCredsBet(bet, credits) {
  document.getElementById("bet").innerText = bet;
  document.getElementById("credits").innerText = credits;
}

function speech(sentence) {
  let text = new SpeechSynthesisUtterance(sentence);

  text.lang = "en";
  text.rate = 1;
  text.pitch = 1;

  window.speechSynthesis.speak(text);
}

function resetGame() {
  // Reset scores
  document.getElementById("player-score").innerText = "0";
  document.getElementById("dealer-score").innerText = "0";

  // Reset bet display
  document.getElementById("bet").innerText = "0";

  // Hide new round button
  document.getElementById("new-round").style.display = "none";

  // Show game buttons
  document.getElementById("draw").style.display = "inline-block";
  document.getElementById("stay").style.display = "inline-block";
  document.getElementById("split").style.display = "inline-block";
  document.getElementById("double").style.display = "inline-block";

  console.log("Game reset for new round");
}

function endGame() {
  // Hide game buttons
  document.getElementById("draw").style.display = "none";
  document.getElementById("stay").style.display = "none";
  document.getElementById("split").style.display = "none";
  document.getElementById("double").style.display = "none";

  // Show new round button
  document.getElementById("new-round").style.display = "inline-block";
}

function checkAndRefillDeck(deck) {
  if (deck.length < 10) {
    // Si moins de 10 cartes restantes
    console.log("Deck running low, creating new deck...");
    const newDeck = deckCreation(5);
    deck.push(...newDeck);
    console.log(`Deck refilled. New deck size: ${deck.length}`);
  }
}

function main(credits, deck) {
  // Check and refill deck if needed
  checkAndRefillDeck(deck);

  const player_hand = []; // Déclare player_hand ici pour qu'elle soit accessible
  const dealer_hand = []; // Déclare dealer_hand ici pour qu'elle soit accessible

  let bet = 0;
  bet = manageCredits(credits, bet);
  credits -= bet;
  changeCredsBet(bet, credits);

  // Start player turn
  playerTurn(
    deck,
    () => {
      // Transition to dealer turn after player ends their turn
      dealerTurn(deck, dealer_hand);

      // Calculate scores
      const playerScore = countCardsInHand(player_hand);
      const dealerScore = countCardsInHand(dealer_hand);

      // Determine the winner
      const result = checkWinner(playerScore, dealerScore, credits, bet);
      console.log(result.message);
      speech(result.message);

      // Update credits with the result
      credits = result.credits;

      // End the game and show new round button
      endGame();

      // Set up new round button event listener
      const newRoundBtn = document.getElementById("new-round");
      newRoundBtn.onclick = function () {
        if (credits <= 0) {
          alert("Game Over! You have no more credits.");
          location.reload(); // Reload the page to start over
          return;
        }

        // Reset the game
        resetGame();

        // Clear hands
        player_hand.length = 0;
        dealer_hand.length = 0;

        // Start new round
        setTimeout(() => {
          main(credits, deck);
        }, 100);
      };
    },
    player_hand
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
