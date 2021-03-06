'use strict';
/*jshint expr:true*/

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const knex = require('../knex');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Sanity check', function () {

    it('true should be true', function () {
            expect(true).to.be.true;

    });

    it('2 + 2 should equal 4', function () {
            expect(2 + 2).to.equal(4);

    });


});


describe.skip('Static Server', function () {

    it('GET request "/" should return the index page', function () {
            chai.request(app)
              .get('/')
            .then(function (res) {
                        expect(res).to.exist;
                        expect(res).to.have.status(400);
                        expect(res).to.be.html;

            });

    });


});

describe.skip('Noteful API', function () {
  const seedData = require('../db/seedData');

    /* ===== ASK ABOUT THIS ========*/
  beforeEach(function () {
    return seedData('./db/noteful.sql');
  });

  after(function () {
    return knex.destroy(); // destroy the connection
  });
    /* ================================*/


  describe('GET /api/notes', function () {

    it('should return the default of 10 Notes ', function () {
      return chai.request(app)
        .get('/api/notes')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(10);
        });
    });

    it('should return correct search results for a valid query', function () {
      return chai.request(app)
        .get('/api/notes?searchTerm=about%20cats')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(4);
          expect(res.body[0]).to.be.an('object');
        });
    });

  });

});

describe('404 handler', function () {

    it('should respond with 404 when given a bad path', function () {
        return chai.request(app)
            .get('/bad/path')
            .then(function (res) {
                expect(res).to.have.status(404);
                expect(res).to.be.json;
            });
    });
});

describe('GET /api/notes', function () {

    it('should return an array of objects where each item contains id, title, and content', function () {
        return chai.request(app)
            .get('/api/notes')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                res.body.forEach(note => {
                    expect(note).to.be.an('object');
                    expect(note).to.include.keys('id', 'title', 'content');
                })
            });
    });

    it('should return an empty array for an incorrect searchTerm', function () {
        return chai.request(app)
            .get('/api/notes?searchTerm=9sd8fu2893uejkasndj@#$$%#$%!@#')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(0);
            });
    });
});

describe('GET /api/notes/:id', function () {

    it('should return correct note when given an id', function () {
        return chai.request(app)
            .get('/api/notes/1004')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.id).to.equal(1004);

            })

    });

    it('should respond with a 404 for an invalid id', function () {
        return chai.request(app)
            .get('/api/notes/000000000')
            .then(function (res) {
                expect(res).to.have.status(404);
            })
    });
});

describe('POST /api/notes', function () {

    it('should create and return a new item when provided valid data', function () {
        const newNote = {title: "note title", content: "some content here"};
        return chai.request(app)
            .post('/api/notes')
            .send(newNote)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys('title', 'id');
                expect(res.body.id).to.not.equal(null);
            });
    });

    it('should return an error when missing "title" field', function () {
        const newNote = {content: "I have no title"};
        return chai.request(app)
            .post('/api/notes')
            .send(newNote)
        .then(function(res) {
            expect(res).to.have.status(400);
            expect(res).to.be.json;
        })
    });


});

describe('PUT /api/notes/:id', function () {

    it('should update the note', function () {
        const testNote = {
                "title": "updated title from cats",
                "content": "cats don't give content",
                "tags": [  ]
        }
        const expectedNote = {
                "title": "updated title from cats",
                "content": "cats don't give content",
                "folderId": null,
                "folderName": null,
                "tags": []
        }
        return chai.request(app)
            .get('/api/notes')
            .then(function(res) {
                testNote.id = res.body[0].id;
                expectedNote.id = res.body[0].id;
                return chai.request(app)
                    .put(`/api/notes/${testNote.id}`)
                    .send(testNote)
            })
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(expectedNote);
            })
    });

    it('should respond with a 404 for an invalid id', function () {
        const newNote = {title: 'sometitle'};
        return chai.request(app)
            .put('/api/notes/0')
            .send(newNote)
            .then(function(res) {
                expect(res).to.have.status(404);
            });
    });

    it('should return an error when missing "title" field', function () {
        const newNote = {content: "I have no title"};
        return chai.request(app)
            .put('/api/notes/1000')
            .send(newNote)
            .then(function(res) {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
            })
    });
});

describe('DELETE  /api/notes/:id', function () {

    it('should delete an item by id', function () {
        return chai.request(app)
            .delete('/api/notes/1000')
            .then(function(res) {
                expect(res).to.have.status(204);
            })
    });
});


