'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("orders", {
    id: {
      type: "int",
      unsigned: true,
      primaryKey: true,
      autoIncrement: true
    },
    shipping_address: {
      type: "string",
      length: 100
    },
    create_datetime: {
      type: "datetime"
    },
    update_datetime: {
      type: "datetime"
    },
    total_cost: {
      type: "int"
    }
  });
};

exports.down = function (db) {
  return db.dropTable("orders");
};

exports._meta = {
  "version": 1
};