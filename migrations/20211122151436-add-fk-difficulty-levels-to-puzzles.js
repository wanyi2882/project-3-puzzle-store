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
  return db.addColumn('puzzles', 'difficulty_level_id', {
    type: 'smallint',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'puzzle_difficulty_level_fk',
      table: 'difficulty_levels',
      rules: {
        onDelete: 'cascade',
        onUpdate: 'restrict'
      },
      mapping: 'id'
    }
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
