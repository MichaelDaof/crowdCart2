var helper = require('../config/helpers.js');
var stripe = require('stripe')("sk_test_z2eawxhaVFZUJmYFVSiDseKm")

module.exports = {
  createStripeCustomer: function (req, res){
    var createCustomerObject = {
      description: req.body.userid,
      source: req.body.token
    };

    stripe.customers.create(createCustomerObject, function(err, customer) {
      if (err){
        console.error(err)
        helper.sendError(err, req, res)
      } else {
        // TODO: Update user (will probably need userid in that customer
        // response body)
        console.log("Successfully created stripe customer: ", customer.id)
        res.end()
      }
    });
  }
}
