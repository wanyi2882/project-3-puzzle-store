const bookshelf = require('../bookshelf')

const Puzzle = bookshelf.model('Puzzle', {
    tableName:'puzzles',
    theme() {
        return this.belongsTo('Theme')
    },
    size() {
        return this.belongsTo('Size')
    },
    AgeGroup() {
        return this.belongsTo('AgeGroup')
    }
});

const Theme = bookshelf.model('Theme', {
    tableName: 'themes',
    Puzzles() {
        return this.hasMany('Puzzle')
    }
})

const Size = bookshelf.model('Size', {
    tableName: 'sizes',
    Puzzles() {
        return this.hasMany('Puzzle')
    }   
})

const AgeGroup = bookshelf.model('AgeGroup', {
    tableName: 'age_groups',
    Puzzles() {
        return this.hasMany('Puzzle')
    } 
})

module.exports = { Puzzle, Theme, Size, AgeGroup };