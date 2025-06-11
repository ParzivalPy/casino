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
  const randomIndex = Math.floor(Math.random() * deck.length);
  if (deck.length === 0) {
    throw new Error("No cards left in the deck");
  }
  let temp = deck.splice(randomIndex, 1)[0];
  delete deck[randomIndex];
  return temp;
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
      if (count + 11 > 21) {
        count += 1;
      } else {
        count += 11;
      }
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
  let card = drawRandomCard(deck);
  hand.push(card);
  countCardsInHand(hand);
  printHand(deck, hand);
  return card;
}

function printHand(deck, hand) {
  console.log("Player's hand:", hand);
  console.log("Count of cards in hand:", countCardsInHand(hand));
  console.log(deck);
}

function main() {
  let deck = deckCreation(5);
  player_hand = [];
  for (let i = 0; i < 2; i++) {
    player_hand.push(drawRandomCard(deck));
  }
  draw(deck, player_hand);
}

main();
