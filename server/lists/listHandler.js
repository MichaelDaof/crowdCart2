// require helper, User, List
var helper = require('../config/helpers.js');
var User = require('../users/userModel.js');
var List = require('./listModel.js');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

  // copies list into collaborator's account
  // finds the collab user's account to grab their info
  // TODO: refactor since some unneeded data might be saved here
  var _copyCollabList = function(list, secondUser) {
    var obj_id = new ObjectId(list.creator_id);
    User.find({"_id": obj_id}, function(err, firstUser){
      if (err) {};
      list.collab_email = firstUser[0].email;
      list.creator_id = secondUser[0]._id;
      List.create(list, function(err, res){
        if (err) {}
        console.log('new list created', res)
      })
    })
  };

  // deletes any collab list that does not have submitted = true
  // submitted is used to verify which has the original copy
  var _removeCollabList = function(draftObj) {
    List.find({"draftObj": draftObj}, function(err, results){
      results.forEach(function(item){
        if (item.submitted !== true) {
          console.log(item)
          List.remove({"_id": item._id}, function(err, results){
            if (err) {console.log(err)}
          })
        }
      })
    })
  }



// export function
module.exports = {

  // TODO:
  // Coordinate with front end on what data
  // should be sent and received.

  // addList method
  addList: function(req, res){
    var newListObj = req.body;
    List.create(newListObj, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo create list err: ", err);
        helper.sendError(err, req, res);
      } else { // list created, sends 201 status
        //res.status(201);
        list.draftObj = list._id;
        list.save();
        res.json(list);
      }
    });
  },

   // updateList method
  updateList: function(req, res){
    var id = req.body.creator_id;
    var due_at = req.body.due_at;
    var name = req.body.name;
    // updatedItems are for new collab items added in draft mode
    // draftObj is the mongo ID for the original list
    // draft is the original creator's ID
    var updatedItems = req.body.items;
    var draftObj = req.body.draftObj;
    var draft = req.body.draft;
    // var conditions = {'creator_id': id, 'due_at': due_at, 'name': name, 'deliverer_id': ''};
    // var update = {'deliverer_id': req.body.deliverer_id};

    // List.update(conditions, update)

    List.findOne({'creator_id': id, 'due_at': due_at, 'name': name}, function(err, list){
          if (err) {
            console.log('List Findone ERROR ****** ');
            console.error(err);
          }
          list.deliverer_id = req.body.deliverer_id;
          list.status = req.body.status;
          list.collab_email = req.body.collab_email;
           if (draft === 'final') {
            // JY
            // If list creator submits edited collab list then draft
            // will be marked final on client this will remove the draft ID
            // and set it as submitted.
            // _removeCollabList will then delete the collab's copy of the list
            list.draft = null;
            list.submitted = true;
            list.save(function(err){
              _removeCollabList(list.draftObj)
            });
            res.json(list)
          } else if (updatedItems && draft) {
            // JY
            // If list is updated and draft ID still exists, then the list
            // will be saved.
            list.items = updatedItems;
            list.save();
            res.json(list)
          } else if (list.collab_email) {
            // JY
            // When user updates their list with a collab_email attached
            // the list will be copied and saved under collab's ID
            // Validates if email is in system
            // TODO: Add an error on client if email is not in system
            User.find({"email": list.collab_email}, function(err, user){
              if (user.length === 0) {
                res.json('user does not exist')
              } else {
                var cb = function() {
                  var listCopy = list;
                  listCopy._id = ObjectId();
                  listCopy.isNew = true;
                  listCopy.save();
                  _copyCollabList(listCopy, user);
                }
                list.draft = id;
                list.save(cb);
                res.json(list);
              }
            })
          } else {
            list.save();
            res.json(list);
          }
        }.bind(this)
    );

  },

  // deleteList method
  deleteList: function(req, res){
    var listid = req.params.id;

    List.remove({'_id': listid}, function(err, result){
      if (err) { // notifies if error is thrown
        console.log("mongo deleteOne list err: ", err);
        helper.sendError(err, req, res);
      } else { // delete successful, sends result of operation
        res.json(result);
      }
    });
  },

  // getOneList method
  getOneList: function(req, res){
    var listid = req.params.id;

    List.findOne({'_id': listid}, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo findOne list err: ", err);
        helper.sendError(err, req, res);
      } else {
        if (!list) { // notifies if list is not found
          helper.sendError("List not found", req, res);
        } else { // list found, returns list
          res.json(list);
        }
      }
    });
  },

  // getLists method
  getLists: function(req, res){
    // var userid = req.body.userid;

    // temporarily passing through url
    var userid = req.params.id

    List.find({'creator_id': userid})
      .then(function(lists){
        res.json(lists);
      });
  },

  // getAllLists method
  getAllLists: function(req, res){
    List.find({})
      .then(function(lists){ // returns array of lists
        console.log("getAllLists function called within listHandler")
        res.json(lists);
      });
  },

  // getJobs method
  getJobs: function(req, res){
    var userid = req.params.id;
    List.find({'deliverer_id': userid})
      .then(function(lists){
        res.json(lists);
      });
  },

  // updateJobStatus method (corrected version)
  updateJobStatus: function(req, res){
    // TODO: Fill Out
  },

  // updateStatus method
  updateStatus: function(req, res){
    var listid = req.body.listid;
    var userid = req.body.userid;

    List.findOne({'_id': listid}, function(err, list){
      if (err) { // notifies if error is thrown
        console.log("mongo findOne list err: ", err);
      } else {
        if (!list) { // notifies if list is not found
          helper.sendError("List not found", req, res);
        } else {
          List.update({'_id': listid}, {'deliverer_id': userid}, function(err, result){
            if (err) { // notifies if error is thrown
              console.log("mongo update err: ", err);
            } else { // update successful, returns result
              res.json(result);
            }
          });
        }
      }
    });
  }

};
