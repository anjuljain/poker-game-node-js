const app = require('express')();
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');

// opening middleware
app.use(cors());
app.use(bodyParser.json());

// basic APIs
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

app.post('/draw', (req, res) => {
    request(`https://deckofcardsapi.com/api/deck/${req.body.deck_id}/draw/?count=${req.body.count}`, (error, response, body) => {
        JSON.parse(body).cards.forEach(element => {
            console.log(element.value + ' of ' + element.suit)
        });
        res.json(JSON.parse(body));
    });
});


// Mixture APIs
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
        console.log('Result after CREATE\n', createResponse);

        // Calling SHUFFLE API
        request.post('http://localhost:3000/shuffle', {
            json: {
                deck_id: JSON.parse(createResponse).deck_id
            }
        }, (error, response, shuffleResponse) => {
            console.log('Result after SHUFFLE\n', shuffleResponse);

            // Calling DRAW API
            request.post('http://localhost:3000/draw', {
                json: {
                    deck_id: JSON.parse(createResponse).deck_id,
                    count: 5
                }
            }, (error, response, drawResponse) => {
                // console.log('Result after DRAW\n', drawResponse);
                res.send('Task accomplished');
                process.exit()
            });

        });
    })
});


function init() {
    request(`http://localhost:3000/create-shuffle-draw`);
}

init();

// initializing port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening in port ' + port);
});