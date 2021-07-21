const router = require('express').Router();

router.use('/api/user', require('./user'));
router.use('/api/checkList', require('./check-list'));
router.use('/api/contractors', require('./contractors'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;