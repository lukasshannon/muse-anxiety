var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var plotly = require('plotly')("DemoAccount", "lr1c37zw81")
  var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
  var layout = {fileopt : "overwrite", filename : "simple-node-example"};

  plotly.plot(data, layout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
