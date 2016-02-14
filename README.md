# README #

### Simple Events Queue for Meteor ###
## using mongodb ##

```
SEQ.push('myQueue', 'myEventName', {test: 'someData', more: 'moreData'});

SEQ.listen('myQueue', optionalListOfEventNames, function(e){
  console.log(e.data);

  e.processing();

  e.reset();  // Send back to SEQ.status.NEW, will be processed again after app restarted

  e.done();

  e.error('Error message goes here')
})

// Will stop listener (use same Queue and Events Names as in listen.
SEQ.stop('myQueue', optionalListOfEventNames);
```
