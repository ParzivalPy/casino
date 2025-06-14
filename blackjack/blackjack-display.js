function createCardElement(card, destinationId) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "game-card-container";
    const cardElement = document.createElement("div");
    cardElement.className = "game-card";
    const cardBack = document.createElement("div");
    cardBack.className = "recto";
    const cardFront = document.createElement("div");
    cardFront.className = "verso";
    cardElement.appendChild(cardBack);
    cardElement.appendChild(cardFront);
    cardContainer.appendChild(cardElement);
    document.getElementById(destinationId).appendChild(cardContainer);
}