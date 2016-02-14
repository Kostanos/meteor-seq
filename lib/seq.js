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
  _handles: {},
  _getHandleName: function(queueName, eventNames){
    var retVal = queueName;
    if (typeof eventNames !== 'undefined'){
      if (!Array.isArray(eventNames)) eventNames = [eventNames];
      retVal += '_' + eventNames.join('_');
    }
    return retVal;
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
  listen: function(queueName, eventNames, callback){
    var self = this;
    var queue = this._getQueue(queueName);
    var handleName = this._getHandleName(queueName);
    var query = {status: this.status.NEW};
    if (typeof eventNames === 'function'){
      callback = eventNames;
    } else {
      if (!Array.isArray(eventNames)) eventNames = [eventNames];
      query.name = {$in: eventNames};
      handleName = this._getHandleName(queueName, eventNames);
    }
    if (handleName in this._handles){
      console.log('Warning: the listener already exists - ' + handleName);
      return;
    }
    this._handles[handleName] = queue.find(query, {sort: {createdAt: 1}}).observe({
      added: function (doc) {
        callback({
          id: doc._id,
          data: doc.data,
          name: doc.name,
          status: doc.status,
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
  },
  stop: function(queueName, eventNames){
    var handleName = this._getHandleName(queueName, eventNames);
    if (handleName in this._handles){
      this._handles[handleName].stop();
      delete this._handles[handleName];
    }
  }
}
