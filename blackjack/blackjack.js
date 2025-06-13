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

function printHand(hand) {
  console.log("Player's hand:", hand);
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

function playerTurn(player_score, deck) {
  const player_hand = [];
  let can_play = false;

  // Initial draw for the player
  for (let i = 0; i < 2; i++) {
    player_hand.push(drawRandomCard(deck));
  }
  let score = printHand(player_hand);
  can_play = true;

  if (can_play && score < 21) {
    // Add event listener for drawing cards
    document.getElementById("draw").addEventListener("click", () => {
      playerTurnDraw(deck, player_hand, can_play, score);
    });

    // Add event listener for ending the turn
    document.getElementById("stay").addEventListener("click", () => {
      can_play = false;
      document.getElementById("draw").removeEventListener("click");
      document.getElementById("stay").removeEventListener("click");
      console.log("Player's final hand:", player_hand);
      console.log("Final count of cards in hand:", countCardsInHand(player_hand)
      );
    });
  }
  return player_score;
}

function main() {
  const deck = deckCreation(5);

  // Player setup
  let player_score = 0;
  playerTurn(player_score, deck);
}

main();
