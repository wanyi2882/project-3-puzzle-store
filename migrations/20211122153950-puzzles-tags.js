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
  return db.createTable('puzzles_tags', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    puzzle_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'puzzles_tags_puzzle_fk',
        table: 'puzzles',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    tag_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'puzzles_tags_tag_fk',
        table: 'tags',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('puzzles_tags');
};

exports._meta = {
  "version": 1
};
