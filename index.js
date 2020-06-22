const app = require('express')();
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
var poker = require('poker-hands');

// opening middleware
app.use(cors());
app.use(bodyParser.json());

// Calling Basic APIs
console.log('Requirement 1: Creating and shuffling a deck of cards');

app.get('/create', (req, res) => {
    request(`https://deckofcardsapi.com/api/deck/new/`, (error, response, body) => {
        res.json(JSON.parse(body))
    });
});

app.post('/shuffle', (req, res) => {
    request(`https://deckofcardsapi.com/api/deck/${req.body.deck_id}/shuffle/`, (error, response, body) => {
        res.json(JSON.parse(body));
    });
});

console.log('Requirement 2: Drawing 5 cards from the hand and printing their numbers and suits to the console.');

app.post('/draw', (req, res) => {
    request(`https://deckofcardsapi.com/api/deck/${req.body.deck_id}/draw/?count=${req.body.count}`, (error, response, body) => {
        JSON.parse(body).cards.forEach(element => {
            console.log(element.value + ' of ' + element.suit)
        });
        res.json(JSON.parse(body));
    });
});



// Calling Mixture APIs
app.get('/create-shuffle', (req, res) => {
    request('http://localhost:3000/create', (error, response, createResponse) => {
        request.post('http://localhost:3000/shuffle', {
            json: {
                deck_id: JSON.parse(createResponse).deck_id
            }
        }, (error, response, shuffleResponse) => {
            res.json(shuffleResponse);
        });
    })
});

app.get('/create-shuffle-draw', (req, res) => {
    // calling CREATE API
    request('http://localhost:3000/create', (error, response, createResponse) => {

        // Calling SHUFFLE API
        request.post('http://localhost:3000/shuffle', {
            json: {
                deck_id: JSON.parse(createResponse).deck_id
            }
        }, (error, response, shuffleResponse) => {
            
            

            // Calling DRAW API
            request.post('http://localhost:3000/draw', {
                json: {
                    deck_id: JSON.parse(createResponse).deck_id,
                    count: 5
                }
            }, (error, response1, drawResponse) => {   
            
            // Calling Get Strength Library     
                request.post('http://localhost:3000/get-strength', {
                    json: {
                        deck_id: JSON.parse(createResponse).deck_id,
                        count: 5
                    }
                }, (error, response, getStrengthResponse) => {
                    console.log('Requirement 3: Identifying the top scoring poker hand that the cards fulfill and printing it to the console.');
                    console.log("Top Scoring Poker Hand Rank is" + " " + getStrengthResponse.result);

            //Printing Poker Hand name Using Switch Case 
                var HandName = getStrengthResponse.result

                        switch (HandName) {
                        case HandName=9:
                                console.log('Name Of Poker Hand Rank Is "High card"');
                            break;
                        case HandName=8:
                                console.log('Name Of Poker Hand Rank Is "One pair"');
                            break;
                        case HandName=7:
                                console.log('Name Of Poker Hand Rank Is "Two pair"');
                            break;
                        case HandName=6:
                                console.log('Name Of Poker Hand Rank Is "Three of a kind"');
                            break;
                        case HandName=5:
                                console.log('Name Of Poker Hand Rank Is "Straight**"');
                            break;
                        case HandName=4:
                                console.log('Name Of Poker Hand Rank Is "Flush**"');
                            break;
                        case HandName=3:
                                console.log('Name Of Poker Hand Rank Is "Full house"');
                            break;
                        case HandName=2:
                                console.log('Name Of Poker Hand Rank Is "Four of a kind"');
                            break;
                        case HandName=1:
                                console.log('Name Of Poker Hand Rank Is "Straight flush**"');
                            break;
                        case HandName=0:
                                console.log('Name Of Poker Hand Rank Is "Five of a kind*"');
                            break;
                        }
                    process.exit();
                });
            });

        });
    })
});

// Get highest-poker-hands
app.post('/get-strength', (req, res) => {

    request(`https://deckofcardsapi.com/api/deck/${req.body.deck_id}/draw/?count=${req.body.count}`, (error, response, body) => {
        let value = '';
        JSON.parse(body).cards.forEach(element => {
            value = value + element.code + " ";
        });
        res.json({
            result: poker.getHandStrength(value.trim())

        });
    });
});

function init() {
    request(`http://localhost:3000/create-shuffle-draw`);
}

init();

// initializing port
const port = process.env.PORT || 3000;
app.listen(port, () => {
});
