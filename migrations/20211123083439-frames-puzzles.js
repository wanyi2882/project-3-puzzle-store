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
  return db.createTable('frames_puzzles', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    frame_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'frames_puzzles_frame_fk',
        table: 'frames',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        },
        mapping: 'id'
      }
    },
    puzzle_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'frames_puzzles_puzzle_fk',
        table: 'puzzles',
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
  return db.dropTable('frames_puzzles');
};

exports._meta = {
  "version": 1
};
