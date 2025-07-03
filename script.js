class Card {
    constructor(name, type, power, color, tipColor, description, imageUrl) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.color = color;
        this.tipColor = tipColor;
        this.description = description;
        this.imageUrl = imageUrl;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class Game {
    constructor() {
        this.playerCards = [];
        this.opponentCards = [];
        this.playedCards = [];
        this.selectedCard = null;
        this.currentPlayer = 'player';
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createDeck();
        this.dealInitialCards();
        this.renderCards();
    }

    createDeck() {
        const cardTypes = [
            {
                name: 'Bushy Tail Fox',
                type: 'Creature',
                power: 7,
                color: 'brown',
                tipColor: 'white',
                description: 'A mystical fox with an enormous bushy tail and rabbit-cat ears. Known for its playful nature and quick reflexes.',
                imageUrl: 'fox-brown.png'
            },
            {
                name: 'Crimson Tail Fox',
                type: 'Creature',
                power: 6,
                color: 'red',
                tipColor: 'gold',
                description: 'A fierce fox with a crimson coat and golden tail tip. Burns with passionate energy.',
                imageUrl: 'fox-red.png'
            },
            {
                name: 'Azure Tail Fox',
                type: 'Creature',
                power: 5,
                color: 'blue',
                tipColor: 'silver',
                description: 'A serene fox with an azure coat and silver tail tip. Calm and wise beyond its years.',
                imageUrl: 'fox-blue.png'
            },
            {
                name: 'Emerald Tail Fox',
                type: 'Creature',
                power: 6,
                color: 'green',
                tipColor: 'gold',
                description: 'A nature-loving fox with an emerald coat and golden tail tip. Brings growth and prosperity.',
                imageUrl: 'fox-green.png'
            },
            {
                name: 'Unicorn Queen',
                type: 'Legendary',
                power: 10,
                color: 'white',
                tipColor: 'rainbow',
                description: 'The majestic ruler of all unicorns. Her presence brings hope and powerful magic to the battlefield.',
                imageUrl: 'unicorn-queen.png'
            },
            {
                name: 'Helper Unicorn',
                type: 'Support',
                power: 3,
                color: 'white',
                tipColor: 'pink',
                description: 'A young unicorn eager to help. Provides support and healing to other creatures.',
                imageUrl: 'unicorn-helper.png'
            },
            {
                name: 'Shadow Tail Fox',
                type: 'Creature',
                power: 8,
                color: 'black',
                tipColor: 'purple',
                description: 'A mysterious fox that emerges from shadows. Its purple-tipped tail glows with ethereal energy.',
                imageUrl: 'fox-black.png'
            },
            {
                name: 'Golden Tail Fox',
                type: 'Creature',
                power: 9,
                color: 'gold',
                tipColor: 'white',
                description: 'A rare and powerful fox with a golden coat. Said to bring fortune to those who encounter it.',
                imageUrl: 'fox-gold.png'
            }
        ];

        this.deck = [];
        for (let i = 0; i < 2; i++) {
            cardTypes.forEach(cardData => {
                this.deck.push(new Card(
                    cardData.name,
                    cardData.type,
                    cardData.power,
                    cardData.color,
                    cardData.tipColor,
                    cardData.description,
                    cardData.imageUrl
                ));
            });
        }
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealInitialCards() {
        for (let i = 0; i < 5; i++) {
            this.playerCards.push(this.deck.pop());
            this.opponentCards.push(this.deck.pop());
        }
    }

    renderCards() {
        this.renderPlayerCards();
        this.renderOpponentCards();
        this.updateStats();
    }

    renderPlayerCards() {
        const container = document.getElementById('playerCards');
        container.innerHTML = '';
        
        this.playerCards.forEach(card => {
            const cardElement = this.createCardElement(card, false);
            cardElement.addEventListener('click', () => this.selectCard(card));
            container.appendChild(cardElement);
        });
    }

    renderOpponentCards() {
        const container = document.getElementById('opponentCards');
        container.innerHTML = '';
        
        this.opponentCards.forEach(card => {
            const cardElement = this.createCardElement(card, true);
            container.appendChild(cardElement);
        });
    }

    createCardElement(card, isHidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardId = card.id;
        
        if (isHidden) {
            cardDiv.innerHTML = `
                <div class="card-back">
                    <div>Mystical Card</div>
                </div>
            `;
        } else {
            cardDiv.innerHTML = `
                <div class="card-image" style="background-image: url('${card.imageUrl}')"></div>
                <div class="card-name">${card.name}</div>
                <div class="card-type">${card.type}</div>
                <div class="card-power">Power: ${card.power}</div>
                <div class="card-tip" style="background-color: ${this.getTipColor(card.tipColor)}"></div>
            `;
            
            cardDiv.addEventListener('click', () => this.showCardDetail(card));
        }
        
        return cardDiv;
    }

    getTipColor(tipColor) {
        const colors = {
            'white': '#ffffff',
            'gold': '#ffd700',
            'silver': '#c0c0c0',
            'pink': '#ff69b4',
            'purple': '#8a2be2',
            'rainbow': 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)'
        };
        return colors[tipColor] || '#ffffff';
    }

    selectCard(card) {
        // Remove previous selection
        document.querySelectorAll('.card.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select new card
        const cardElement = document.querySelector(`[data-card-id="${card.id}"]`);
        if (cardElement) {
            cardElement.classList.add('selected');
            this.selectedCard = card;
        }
    }

    playCard() {
        if (!this.selectedCard) return;
        
        // Move card from player hand to played cards
        const cardIndex = this.playerCards.findIndex(c => c.id === this.selectedCard.id);
        if (cardIndex > -1) {
            const playedCard = this.playerCards.splice(cardIndex, 1)[0];
            this.playedCards.push(playedCard);
            
            // AI opponent plays a card
            this.opponentPlayCard();
            
            this.selectedCard = null;
            this.renderCards();
            this.renderPlayedCards();
        }
    }

    opponentPlayCard() {
        if (this.opponentCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.opponentCards.length);
            const opponentCard = this.opponentCards.splice(randomIndex, 1)[0];
            this.playedCards.push(opponentCard);
        }
    }

    renderPlayedCards() {
        const container = document.getElementById('playedCards');
        container.innerHTML = '';
        
        this.playedCards.forEach(card => {
            const cardElement = this.createCardElement(card, false);
            container.appendChild(cardElement);
        });
    }

    drawCard() {
        if (this.deck.length > 0 && this.playerCards.length < 7) {
            this.playerCards.push(this.deck.pop());
            this.renderCards();
        }
    }

    endTurn() {
        if (this.selectedCard) {
            this.playCard();
        }
        this.currentPlayer = this.currentPlayer === 'player' ? 'opponent' : 'player';
    }

    newGame() {
        this.playerCards = [];
        this.opponentCards = [];
        this.playedCards = [];
        this.selectedCard = null;
        this.currentPlayer = 'player';
        document.getElementById('playedCards').innerHTML = '';
        this.initializeGame();
    }

    showCardDetail(card) {
        const modal = document.getElementById('cardDetailModal');
        const modalImage = document.getElementById('modalCardImage');
        const modalName = document.getElementById('modalCardName');
        const modalType = document.getElementById('modalCardType');
        const modalPower = document.getElementById('modalCardPower');
        const modalDescription = document.getElementById('modalCardDescription');
        
        modalImage.src = card.imageUrl;
        modalImage.alt = card.name;
        modalName.textContent = card.name;
        modalType.textContent = `Type: ${card.type}`;
        modalPower.textContent = `Power: ${card.power}`;
        modalDescription.textContent = card.description;
        
        modal.style.display = 'block';
    }

    updateStats() {
        document.getElementById('playerCardCount').textContent = this.playerCards.length;
        document.getElementById('opponentCardCount').textContent = this.opponentCards.length;
    }

    bindEvents() {
        document.getElementById('drawCardBtn').addEventListener('click', () => this.drawCard());
        document.getElementById('endTurnBtn').addEventListener('click', () => this.endTurn());
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        
        const modal = document.getElementById('cardDetailModal');
        const closeBtn = document.getElementById('closeModal');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});

