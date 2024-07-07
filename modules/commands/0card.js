module.exports.config = {
    name: "card",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "YourName",
    description: "Play a game of blackjack. You need to bet $50 or more to start the game.",
    commandCategory: "games",
    usages: "card [bet amount]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Minimum bet amount
    const minimumBet = 50;

    // Check if a valid bet amount is provided
    let betAmount = parseInt(args[0]);
    if (isNaN(betAmount) || betAmount < minimumBet) {
        return api.sendMessage(`Please bet $${minimumBet} or more to play.`, threadID, messageID);
    }

    // Helper function to create a deck of cards
    function createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        return deck;
    }

    // Helper function to shuffle the deck
    function shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // Helper function to calculate the value of a hand
    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else if (card.value === 'A') {
                value += 11;
                aces++;
            } else {
                value += parseInt(card.value);
            }
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    // Helper function to get a string representation of a hand
    function handToString(hand) {
        const cardEmoji = {
            '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', '10': '🔟', 
            'J': '🃏', 'Q': '👸', 'K': '🤴', 'A': '🅰️'
        };
        return hand.map(card => `${cardEmoji[card.value]} of ${card.suit}`).join(', ');
    }

    // Initialize the game
    const deck = createDeck();
    shuffle(deck);

    const playerHand = [deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop()];

    // Check for initial blackjack
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue === 21 && dealerValue === 21) {
        return api.sendMessage("It's a tie! Both you and the dealer have blackjack!", threadID, messageID);
    } else if (playerValue === 21) {
        return api.sendMessage("Congratulations! You have blackjack and win the game!", threadID, messageID);
    } else if (dealerValue === 21) {
        return api.sendMessage("The dealer has blackjack. You lose.", threadID, messageID);
    }

    // Send initial hand to the player
    api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${calculateHandValue(playerHand)})\nDealer's hand: ${handToString([dealerHand[0]])}, [Hidden]`, threadID, messageID);

    // Function to handle the player's decision (hit or stand)
    async function handlePlayerDecision() {
        api.sendMessage("Type 'hit' to draw another card or 'stand' to end your turn.", threadID, (err, info) => {
            if (err) return console.error(err);

            global.client.handleReply.push({
                name: module.exports.config.name,
                messageID: info.messageID,
                author: senderID,
                playerHand,
                dealerHand,
                deck
            });
        });
    }

    // Initial call to handle the player's decision
    handlePlayerDecision();
};

module.exports.handleReply = async function({ handleReply, event, api }) {
    const { author, playerHand, dealerHand, deck } = handleReply;
    const { threadID, messageID, senderID, body } = event;

    if (senderID !== author) return;

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (body.trim().toLowerCase() === 'hit') {
        playerHand.push(deck.pop());
        const newPlayerValue = calculateHandValue(playerHand);

        if (newPlayerValue > 21) {
            return api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${newPlayerValue})\nYou have busted! Dealer wins.`, threadID, messageID);
        }

        api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${newPlayerValue})\nDealer's hand: ${handToString([dealerHand[0]])}, [Hidden]`, threadID, messageID);
        return handlePlayerDecision();
    } else if (body.trim().toLowerCase() === 'stand') {
        let newDealerValue = dealerValue;
        while (newDealerValue < 17) {
            dealerHand.push(deck.pop());
            newDealerValue = calculateHandValue(dealerHand);
        }

        const finalPlayerValue = calculateHandValue(playerHand);
        const finalDealerValue = newDealerValue;

        if (finalDealerValue > 21 || finalPlayerValue > finalDealerValue) {
            return api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${finalPlayerValue})\nDealer's hand: ${handToString(dealerHand)} (Value: ${finalDealerValue})\nYou win!`, threadID, messageID);
        } else if (finalDealerValue > finalPlayerValue) {
            return api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${finalPlayerValue})\nDealer's hand: ${handToString(dealerHand)} (Value: ${finalDealerValue})\nDealer wins.`, threadID, messageID);
        } else {
            return api.sendMessage(`Your hand: ${handToString(playerHand)} (Value: ${finalPlayerValue})\nDealer's hand: ${handToString(dealerHand)} (Value: ${finalDealerValue})\nIt's a tie!`, threadID, messageID);
        }
    } else {
        return api.sendMessage("Invalid command. Type 'hit' to draw another card or 'stand' to end your turn.", threadID, messageID);
    }
};
