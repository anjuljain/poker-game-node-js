var request = require('request');
var index = require('../index.js');
var expect = require("chai").expect
const bodyParser = require('body-parser');


describe('Task API Routes', function() {
    // This function will run before every test to clear database
    

    // In this test it's expected a task list of two tasks
    describe('GET /tasks', function() {
        it('returns a list of tasks', function(done) {
            request.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
                .expect(res.sucess, true);
                
        });
    });

});