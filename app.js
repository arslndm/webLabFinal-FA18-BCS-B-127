const Joi = require("joi");
const express = require("express");
const app = express();
const teamMatches = require("./teamMactches.json");
const allTeams = require("./allTeams.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/allTeams", (req, res) => {
  res.send(allTeams);
});

app.get("/allTeams/:id", (req, res) => {
  const team = allTeams.find((c) => c.id === parseInt(req.params.id));

  if (!team) {
    return res.status(404).send("The team is not found :(");
  } else {
    res.send(team);
  }
});

app.get("/teamMatches", (req, res) => {
  res.send(teamMatches);
});

app.get("/teamMatches/:id", (req, res) => {
  const match = teamMatches.find((c) => c.id === parseInt(req.params.id));

  if (!match) {
    return res.status(404).send("The match is not found :(");
  } else {
    res.send(match);
  }
});

app.post("/teamMatches", (req, res) => {
  const { error } = validateMatches(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const match = {
    id: teamMatches.length + 1,
    city: req.body.city,
    date: req.body.date,
    teamA: req.body.teamA,
    teamB: req.body.teamB,
  };

  teamMatches.push(match);
  res.send(match);
});

app.put("/teamMatches/:id", (req, res) => {
  const match = teamMatches.find((c) => c.id === parseInt(req.params.id));
  if (!match) {
    return res.status(404).send("The Match is not found :(");
  }

  const { error } = validateMatches(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  match.city = req.body.city;
  match.date = req.body.date;
  match.teamA = req.body.teamA;
  match.teamB = req.body.teamB;

  res.send(match);
});

app.delete("/teamMatches/:id", (req, res) => {
  const match = teamMatches.find((c) => c.id === parseInt(req.params.id));
  if (!match) {
    return res.status(404).send("The Match is not found :(");
  }

  const index = teamMatches.indexOf(match);
  teamMatches.splice(index, 1);

  res.send(match);
});

function validateMatches(match) {
  const schema = Joi.object({
    city: Joi.string().min(5).required(),
    date: Joi.date().min(5).required(),
    teamA: Joi.string().min(6).required(),
    teamB: Joi.string().min(6).required(),
  });
  return schema.validate(match);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
