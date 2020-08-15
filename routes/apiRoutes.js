var db = require("../models");

module.exports = function(app) {
  // Get comments by candidate number
  app.get("/api/comments/:candidate_number", function(req, res) {
    db.Score.findAll({ where: { candidate_number: req.params.candidate_number }}).then(function(comments) {
      res.json(comments);
      console.log(comments)
    });
  });

  // Judge posts a new score
  app.post("/api/judge", function(req, res) {
    db.Score.create(req.body).then(function(dbScore) {
      res.json(dbScore);
      console.log(dbScore)
    });
  });


// Add a judge to the judges table

app.post("/api/judgeregister", function(req, res) {
  db.Judge.create(req.body).then(function(dbJudge) {
    res.json(dbJudge);
    console.log(dbJudge)
  });
});

app.post("/api/candidateregister", function(req, res) {
  db.Candidate.create(req.body).then(function(dbCandidate) {
    res.json(dbCandidate);
    console.log(dbCandidate)
  });
});


}