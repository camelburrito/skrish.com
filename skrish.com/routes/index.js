
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
exports.vivi = function(req, res){
  res.render('vivi',{ title: 'Happy Birthday Viviktha!' })
};