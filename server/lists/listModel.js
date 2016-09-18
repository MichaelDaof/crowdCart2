var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  // accepts "open", "accepted" and "completed"
  status: { type: String, default: "open"},
  delivered_at: Date,
  due_at: Date,
  expired_at: Date,
  creator_id: String,
  deliverer_id: String,
  collab_email: String,
  draft: String,
  draftObj: String,
  submitted: Boolean,
  //items is a array containing all list items
  //Each item should be follow this structure:
  // {
  //    item_name: String,
  //    quantity:  Number,
  //    unite_price: Number  //this is typo, and too late to change for us.
  // }

  items : [],
  total_price: Number,
  offer_price: Number,

  //If delivery address is different from list creator's address
  delivery_address: {
    street: String,
    city: String,
    state: String,
    zip_code: Number
  }
});

module.exports = mongoose.model('List', ListSchema);
