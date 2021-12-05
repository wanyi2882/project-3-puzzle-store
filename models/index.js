const bookshelf = require('../bookshelf')

const Puzzle = bookshelf.model('Puzzle', {
    tableName: 'puzzles',
    Theme() {
        return this.belongsTo('Theme')
    },
    Size() {
        return this.belongsTo('Size')
    },
    AgeGroup() {
        return this.belongsTo('AgeGroup')
    },
    DifficultyLevel() {
        return this.belongsTo('DifficultyLevel')
    },
    Material() {
        return this.belongsTo('Material')
    },
    Tag() {
        return this.belongsToMany('Tag')
    },
    Frame() {
        return this.belongsToMany('Frame')
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

const DifficultyLevel = bookshelf.model('DifficultyLevel', {
    tableName: 'difficulty_levels',
    Puzzles() {
        return this.hasMany('Puzzle')
    }
})

const Material = bookshelf.model('Material', {
    tableName: 'materials',
    Puzzles() {
        return this.hasMany('Puzzle')
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    Puzzles() {
        return this.belongsToMany('Puzzle')
    }
})

const Frame = bookshelf.model('Frame', {
    tableName: 'frames',
    Puzzles() {
        return this.belongsToMany('Puzzle')
    }
})

const User = bookshelf.model('User',{
    tableName: 'users'
})

const CartDetail = bookshelf.model('CartDetail', {
    tableName: 'cart_details',
    Puzzle() {
        return this.belongsTo('Puzzle')
    }    
})

const BlacklistedToken = bookshelf.model('BlacklistedToken',{
    'tableName': 'blacklisted_tokens'
})

const Order = bookshelf.model('Order', {
    'tableName': 'orders',
    OrderStatus() {
        return this.belongsTo('OrderStatus')
    },
    OrderDetail() {
        return this.hasMany('OrderDetail')
    }
})

const OrderStatus = bookshelf.model('OrderStatus', {
    'tableName': 'order_statuses',
    Orders() {
        return this.hasMany('Order')
    }
})

const OrderDetail = bookshelf.model('OrderDetail', {
    'tableName': 'order_details',
    Puzzle() {
        return this.belongsTo('Puzzle')
    }
})

module.exports = { Puzzle, Theme, Size, AgeGroup, DifficultyLevel, Material, Tag, Frame, User, CartDetail, BlacklistedToken, Order, OrderStatus, OrderDetail };