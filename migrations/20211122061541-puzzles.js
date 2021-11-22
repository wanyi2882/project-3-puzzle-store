'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('puzzles',{
    id: { 
      type: 'int', 
      primaryKey: true, 
      autoIncrement: true, 
      unsigned: true
    },
    title: { 
      type: 'string', 
      length: 200
    },
    cost: 'int',
    description: 'text',
    image: {
      type: 'string', 
      length: 2083
    },
    stock: 'int',
    length: 'int',
    breadth: 'int',
    brand: {
      type: 'string',
      length: 45
    }
  })
};

exports.down = function(db) {
  return db.dropTable('puzzles')
};

exports._meta = {
  "version": 1
};
