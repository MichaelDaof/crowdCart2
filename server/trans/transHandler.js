var helper = require('../config/helpers.js');

module.exports = {
  createStripeCustomer: function (req, res){
  console.log("Successfully received Stripe token: ", req.body)
  // TODO:
  //   1. Create stripe customer
  //   2. Update user (will probably need userid in that request body)
  res.end()
  }
}
