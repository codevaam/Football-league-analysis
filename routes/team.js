const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Team = require("../models/team").Team
const Player = require("../models/player").Player
router.get("/", async function (req, res) {
    const teams = await Team.find({});
    const templateVals = {
        model: "teams",
        fields: [{ name: 'teamID', type: 'ID', model: 'teams' },
        { name: 'name', type: 'prop', model: '' },
        { name: 'shortName', type: 'prop', model: '' },
        { name: 'teamType', type: 'prop', model: '' }],
        data: teams
    };
    res.render('listModel', templateVals);
});

router.get("/:id", async (req, res) => {
    console.log(req.params.id);
    const team = await Team.findOne({teamID: req.params.id}).exec();
    const players = await Player.find({currentTeam: parseInt(team.teamID)}).exec();
    res.render('team', {team, players});
});

exports.router = router;
