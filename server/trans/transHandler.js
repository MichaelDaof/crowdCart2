var helper = require('../config/helpers.js');
var stripe = require('stripe')("sk_test_z2eawxhaVFZUJmYFVSiDseKm");
var User = require('../users/userModel.js');

var updateUserStripeId = function (req, res, userid, type, stripeId, cb){
  User.findById(userid)
    .exec(function(err, user){
      if (err) {
        console.error("Failed to find user in database: ", err);
      } else { //found
        user.stripe.verified = true;
        user.stripe[type] = stripeId;
        user.save(function (err, doc){
          if (err){
            console.error("Failed to udpate user stripe " + type.toUpperCase() + ": ", user.stripe)
          } else {
            console.log("Successfully updated user stripe " + type.toUpperCase() + ": ", user.stripe)
            if (cb){
              cb(req, res, userid)
            } else {
              res.end()
            }
          }
        })
      }
    })
};

var createStripeCustomer = function (req, res, userid, token){

    stripe.customers.create({
      description: userid,
      source: token
    }, function(err, customer) {
      if (err){
        console.error(err)
        helper.sendError(err, req, res)
      } else {
        // Will async second Stripe API request after first one ends
        updateUserStripeId(req,
          res,
          userid,
          "customer",
          customer.id,
          createStripeAccount)
        console.log("Successfully created stripe customer: ", customer.id)
      }
    });

};

var createStripeAccount = function (req, res, user){
    // creates managed stripe accounts (contractors)
    stripe.accounts.create({
      managed: true,
      country: 'US'
    }, function(err, account) {
      if (err){
        console.error(err);
        helper.sendError(err, req, res);
      } else {
        updateUserStripeId(req, res, user, "account", account.id)
        console.log("Successfully created stripe account: ", account.id)
      }
    });

};

module.exports = {
  initializeStripe: function (req, res){
    // async chain: createStripeCustomer >
    //   updateUserStripeId >
    //   createStripeAccount >
    //   updateUserStripeId :: res.end()
    createStripeCustomer(req, res, req.body.userid, req.body.token)
  }
}
