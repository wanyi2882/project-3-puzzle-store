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
  return db.createTable('frames', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    material: {
      type: 'string',
      length: 100
    },
    colour: {
      type: 'string',
      length: 45
    },
    cost: 'int'
  });
};

exports.down = function(db) {
  return db.dropTable('frames');
};

exports._meta = {
  "version": 1
};
