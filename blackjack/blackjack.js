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

  // Initial draw for the player
  for (let i = 0; i < 2; i++) {
    player_hand.push(drawRandomCard(deck));
  }
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
  if (playerScore > 21) {
    return "Dealer wins! Player busted.";
  } else if (dealerScore > 21) {
    credits = credits + 2 * bet;
    return `Player wins! Dealer busted. New credits: ${credits}`;
  } else if (playerScore > dealerScore) {
    credits = credits + 2 * bet;
    return `Player wins! New credits: ${credits}`;
  } else if (dealerScore > playerScore) {
    return "Dealer wins!";
  } else {
    credits += bet; // Return the bet to the player in case of a tie
    return `It's a tie! Credits returned: ${credits}`;
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

function main(credits, deck) {
  const player_hand = []; // Déclare player_hand ici pour qu'elle soit accessible
  const dealer_hand = []; // Déclare dealer_hand ici pour qu'elle soit accessible

  let bet = 0;
  bet = manageCredits(credits, bet);
  credits -= bet;
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
      console.log(result);
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
