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
  console.log("Count of cards in hand:", countCardsInHand(hand));
}

function playerTurnDraw(deck, hand, end_turn, can_play) {
  if (!end_turn && can_play) {
    const card = draw(deck, hand);
    const total = countCardsInHand(hand);
    printHand(hand);

    if (total > 21) {
      console.log("Bust! Player exceeded 21 points.");
      end_turn = true; // End the turn if the player exceeds 21
    }
  }
}

function main() {
  const deck = deckCreation(5);

  // Player setup
  const player_hand = [];
  let can_play = false;
  let end_turn = false;

  // Initial draw for the player
  for (let i = 0; i < 2; i++) {
    player_hand.push(drawRandomCard(deck));
  }
  can_play = true;

  // Add event listener for drawing cards
  document.getElementById("draw").addEventListener("click", () => {
    playerTurnDraw(deck, player_hand, end_turn, can_play);
  });
}

main();