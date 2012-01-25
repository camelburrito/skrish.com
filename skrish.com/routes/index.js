
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
exports.puzzle = function(req, res){
  res.render('puzzle', {})
};
exports.test = function(req, res){
  res.render('json',{ title: 'Express' })
};