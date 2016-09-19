var helper = require('../config/helpers.js');
var stripe = require('stripe')("sk_test_1r3gT6ho7rW8BEEC9KIBQhrS");
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
            if (cb){
              cb(req, res, userid)
            } else {
              console.log("Successfully updated user with stripe CUSTOMER and ACCOUNT id: ", user.stripe)
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
  },

  p2pTrx: function (req, res, list){
    var amount = list.offer_price;

    User.findById(list.deliverer_id)
      .then(function (payee){

        User.findById(list.creator_id)
          .then(function (payor){
            // Stripe claims charges are synchronous calls. Can't use "then".
            stripe.charges.create({
              amount: amount,
              currency: 'usd',
              customer: payor.stripe.customer,
              destination: payee.stripe.account
            },
            function (err, charge){
              if (err){
                console.error("P2P Stripe charge failed: ", err)
                helper.sendError(err, req, res)
              } else {
                payee.credit += amount;
                payee.save()
                  .then(function (doc){
                    // Saves status update to "complete"
                    console.log("payee after charge: ", doc)
                    list.save()
                      .catch(function (err){
                        console.error("Failed to update list status to 'complete' after charge. Charge: ", charge, "Error: ", err);
                        helper.sendError(err, req, res);
                      })
                  })
                  .catch(function (err){
                    console.error("Failed to credit payee after charge. Charge: ", charge, "Error: ", err);
                    helper.sendError(err, req, res);
                  })
              } // else
            }) // charge cb
          })
          .catch(function (err){
            console.error("Failed to find payee during transaction. Charge cancelled.");
            helper.sendError(err, req, res);
          })
      })
      .catch(function(err){
        console.error("Failed to find payee during transaction. Charge cancelled.");
        helper.sendError(err, req, res);
      })
  }
}
