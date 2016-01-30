SEQ = {
  status: {
    NEW: 'NEW',
    PROCESSING: 'PROCESSING',
    DONE: 'DONE',
    ERROR: 'ERROR',
  },
  _queues: {},
  _getQueue: function(name){
    if (!(name in this._queues)) {
      this._queues[name] = new Mongo.Collection('seq_' + name);
    }
    return this._queues[name];
  },
  push: function(queueName, eventName, data){
    var queue = this._getQueue(queueName);
    queue.insert({
      name: eventName,
      status: this.status.NEW,
      data: data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, function(){ /* TODO: error handle */});
  },
  listen: function(queueName, eventNemes, callback){
    var self = this;
    var queue = this._getQueue(queueName);
    queue.find({status: this.status.NEW}, {sort: {createdAt: 1}}).observe({
      added: function (doc) {
        callback({
          id: doc._id,
          data: doc.data,
          processing: function(){
            queue.update({_id: this.id}, {$set: {status: self.status.PROCESSING, updatedAt: new Date()}}, function(){});
          },
          reset: function(){
            queue.update({_id: this.id}, {$set: {status: self.status.NEW, updatedAt: new Date()}}, function(){});
          },
          done: function(){
            queue.update({_id: this.id}, {$set: {status: self.status.DONE, updatedAt: new Date()}}, function(){});
          },
          error: function(errorData){
            queue.update({_id: this.id}, {$set: {status: self.status.ERROR, updatedAt: new Date(), error: errorData}}, function(){});
          }
        });
      }
    });
  }
}
