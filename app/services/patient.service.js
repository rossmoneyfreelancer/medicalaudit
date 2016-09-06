var mongoose = require('mongoose'),
Patient = mongoose.model('Patient');
Session = mongoose.model('Session');

exports.findAll = function(req, res){
  /*Session.findById({id: req.tokenid}, function(err, result) {
	if (err) return console.log(err);
	if(result.tokenid == req.tokenid && result.expired == 'N') {*/
		Patient.find({},function(err, results) {
			return res.send(results);
		});
	/*}
  });*/
};
exports.findById = function(req, res){
  var id = req.params.id;
  Patient.findOne({'_id':id},function(err, result) {
    return res.send(result);
  });
};
exports.add = function(req, res) {
  Patient.create(req.body, function (err, musician) {
    if (err) return console.log(err);
    return res.send(musician);
  });
}
exports.update = function(req, res) {
  var id = req.params.id;
  var token = req.params.tokenid;
  var updates = req.body;
  
  Session.findById({id: req.params.tokenid}, function(err, result) {
	if (err) return console.log(err);
	if(result.tokenid == req.params.tokenid && result.expired == 'N') {
		
  Patient.update({"_id":id}, req.body,
    function (err, numberAffected) {
      if (err) return console.log(err);
      console.log('Updated %d musicians', numberAffected);
      res.send(202);
  });
  
  }
  });
}
exports.delete = function(req, res){
  var id = req.params.id;
  Patient.remove({'_id':id},function(result) {
    return res.send(result);
  });
};

exports.import = function(req, res){
  Patient.create(
    { "name": "Ben", "band": "DJ Code Red", "instrument": "Reason" },
    { "name": "Mike D.","band": "Kingston Kats", "instrument": "drums" },
    { "name": "Eric", "band": "Eric", "instrument": "piano" },
    { "name": "Paul", "band": "The Eyeliner", "instrument": "guitar" }
  , function (err) {
    if (err) return console.log(err);
    return res.send(202);
  });
};

