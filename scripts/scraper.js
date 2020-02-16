const rp = require("request-promise");
const mongoose = require("mongoose");
require("dotenv").config();

const db = require("../models");

COMPETITIONS_URL =
  "https://footballapi.pulselive.com/football/competitions?page=0&pageSize=100&detail=2";

TEAMS_URL = "https://footballapi.pulselive.com/football/compseasons/274/teams";

let range = n => Array.from(Array(n).keys())

async function main() {
  await db.connect(process.env.DB_HOST);
  console.log("Scraping Leagues");
  const comps = await rp({
    uri: COMPETITIONS_URL,
    json: true
  });

  //Clear database
  await Promise.all([
    db.league.League.deleteMany({}).exec(),
    db.season.Season.deleteMany({}).exec(),
    db.team.Team.deleteMany({}).exec(),
    db.player.Player.deleteMany({}).exec(),
    db.seasonPlayer.SeasonPlayer.deleteMany({}).exec(),
    db.goal.Goal.deleteMany({}).exec(),
    db.fixture.Fixture.deleteMany({}).exec(),
  ]);

  //Insert leagues and seasons
  const seasons = [];
  const leagueDocs = comps.content.map(function(comp) {
    comp.compSeasons.map(function(season) {
      const id = mongoose.Types.ObjectId();
      seasons.push({
        _id: id,
        seasonID: season.id,
        name: season.label,
        leagueID: comp.id,
      });
    });

    return {
      _id: mongoose.Types.ObjectId(),
      leagueID: comp.id,
      abbr: comp.abbreviation,
      name: comp.description,
      level: comp.level,
    };
  });

  // scrapeSeasons = [274, 210, 288, 214, 286, 213, 316,209];
  scrapeSeasons = [210, 214, 213, 209, 274, 288, 286, 316];
  scrapeSeasons.sort(); // Latest seasons write last
  seasonTeams = await Promise.all(
    scrapeSeasons.map(season => {
      console.log(`Scraping teams for seasonID ${season}`);
      const url = `https://footballapi.pulselive.com/football/compseasons/${season}/teams`;
      return rp({
        uri: url,
        json: true
      });
    })
  );

  teams = {};
  
  for (let i = 0; i<scrapeSeasons.length; i++) {
    const teamList = seasonTeams[i];
    for (const team of teamList) {
      const newTeam = {
        teamID: team.id,
        name: team.name,
        shortName: team.shortName,
        teamType: team.teamType,
        seasonID: [scrapeSeasons[i]]
      }

      if (teams[team.id]) {
        teams[team.id].seasonID.push(scrapeSeasons[i])
      } else {
        teams[team.id] = newTeam;
      }
    }
  }

  teams = Object.values(teams);
  players = {};
  seasonPlayers = []
  for (const season of scrapeSeasons) {
    console.log(`Scraping players for seasonID ${season}`);
    (await Promise.all(range(30).map((page) => {
      const url = `https://footballapi.pulselive.com/football/players?pageSize=30&compSeasons=${season}&altIds=true&page=${page}&type=player&compSeasonId=${season}`
        return rp({
          uri: url,
          json: true
        });
    }))).map((page) => {
      for (const player of page.content) {
        let currentTeam;
        if (player.currentTeam) {
          currentTeam = player.currentTeam.id; 
        }
        players[player.id] = {
          playerID: player.id,
          name: player.name.display,
          position: player.info.positionInfo,
          shirtNum: player.info.shirtNum,
          currentTeam: currentTeam,
          country: player.nationalTeam.country,
          birthDate: player.birth.date ? player.birth.date.label : "None",
        };
        seasonPlayers.push({
          seasonID: season,
          playerID: player.id,
          teamID: currentTeam
        });
      }
    });
  }

  players = Object.values(players);
  fixtures = {};
  goals = [];
  for (const season of scrapeSeasons) {
    console.log(`Scraping fixtures for seasonID ${season}`);
    (await Promise.all(range(15).map((page) => {
      const url = `https://footballapi.pulselive.com/football/fixtures?compSeasons=${season}&page=${page}&pageSize=40&sort=desc&statuses=C&altIds=true`
        return rp({
          uri: url,
          json: true
        });
    }))).map((page) => {
      for (const match of page.content) {
        team1 = match.teams[0].team.id;
        team2 = match.teams[1].team.id;
        team1_score = match.teams[0].score;
        team2_score = match.teams[1].score;
        match_date = match.kickoff.label;
        fixtureID = match.id

        fixtures[fixtureID] = {
          fixtureID: fixtureID,
          date: match_date,
          team1: team1,
          team2: team2,
          team1Score: team1_score,
          team2Score: team2_score,
          seasonID: season
        }

        for (const goal of match.goals) {
          goals.push({
            fixtureID: fixtureID,
            time: goal.clock.secs,
            goalType: goal.type,
            playerID: goal.personId,
            assistID: goal.assistId
          });
        }
      }
    });
  }

  fixtures = Object.values(fixtures);

  console.log("--------------------------------")
  console.log("Results: ");
  console.log(`${leagueDocs.length} leagues`);
  console.log(`${seasons.length} seasons`);
  console.log(`${teams.length} teams`);
  console.log(`${players.length} players`);
  console.log(`${fixtures.length} fixtures`);
  console.log(`${goals.length} goals`);
  console.log("--------------------------------")

  await Promise.all([
    db.league.League.insertMany(leagueDocs),
    db.season.Season.insertMany(seasons),
    db.team.Team.insertMany(teams),
    db.player.Player.insertMany(players),
    db.seasonPlayer.SeasonPlayer.insertMany(seasonPlayers),
    db.fixture.Fixture.insertMany(fixtures),
    db.goal.Goal.insertMany(goals),
  ]);
  await db.disconnect();
}

main();
