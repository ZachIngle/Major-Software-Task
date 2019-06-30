var request = require('request');
var cheerio = require('cheerio');
var rp = require('request-promise');
const fs = require('fs');

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'ChampionStats.txt', autoload: true });

rp('https://leagueoflegends.fandom.com/wiki/List_of_champions/Base_statistics')
  .then(function (htmlString){
    // Check if ChampionStats.txt exists and if does delete
    if (fs.existsSync('ChampionStats.txt')) {
        fs.unlinkSync('ChampionStats.txt');
        console.log('Sucessfully deleted ChampionStats.txt');
    }
    var $ = cheerio.load(htmlString); // Load html into a cheerio object
    var championList = [];
    $('table tbody tr').map(function(i, element){ // Look in $ for table rows(tr)
      var a = $(this); // Assign the found element
      var td = a.children(); // Get all the children elements of a
      var champions = td.children().eq(0).text();
      var hp = td.eq(1).text().slice(0, -1); // Slices get rid of a \n at the end
      var hpplus = td.eq(2).text().slice(0, -1);
      var hp5 = td.eq(3).text().slice(0, -1);
      var hp5plus = td.eq(4).text().slice(0, -1);
      var mp = td.eq(5).text().slice(0, -1);
      var mpplus = td.eq(6).text().slice(0, -1);
      var mp5 = td.eq(7).text().slice(0, -1);
      var mp5plus = td.eq(8).text().slice(0, -1);
      var ad = td.eq(9).text().slice(0, -1);
      var adplus = td.eq(10).text().slice(0, -1);
      var as = td.eq(11).text().slice(0, -1);
      var asplus = td.eq(12).text().slice(0, -1);
      var ar = td.eq(13).text().slice(0, -1);
      var arplus = td.eq(14).text().slice(0, -1);
      var mr = td.eq(15).text().slice(0, -1);
      var mrplus = td.eq(16).text().slice(0, -1);
      var ms = td.eq(17).text().slice(0, -1);
      var range = td.eq(18).text().slice(0, -1);

      // Parses data found into a single object
      var championI = {
        "Champion": champions,
        "HP": hp,
        "HP+": hpplus,
        "HP5": hp5,
        "HP5+": hp5plus,
        "MP": mp,
        "MP+": mpplus,
        "MP5": mp5,
        "MP5+": mp5plus,
        "AD": ad,
        "AD+": adplus,
        "AS": as,
        "AS+": asplus,
        "AR": ar,
        "AR+": arplus,
        "MR": mr,
        "MR+": mrplus,
        "MS": ms,
        "Range": range
      };
      championList.push(championI);
    });
    console.log(championList);
    // Remove first item from list as it is the headers
    championList.shift();
    // Remove last three items from list as they're not champions
    for(i=0; i < 3; i++) {championList.pop()};
    championList.forEach((item) => db.insert(item, function(err, doc) {
      console.log('Inserted', doc.name, 'with ID', doc._id);
      }));
  })
  .catch(function (err) {
    console.log('Unable to connect to base statistics website')
  });
