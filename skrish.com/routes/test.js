/*
 * GET test JSON.
 */

exports.test = function(req, res){
  res.render('json',{ title: 'Express' })
};