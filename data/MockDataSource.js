const _ = require('lodash');
const { DataSource, DataModel } = require('../library/DataSource');

const data = {
    SlotEntranceDistances: [
        [ 11, 19, 10 ],
        [ 14, 11, 16 ],
        [ 15, 6, 3 ],
        [ 4, 18, 15 ],
        [ 5, 13, 19 ],
        [ 7, 1, 5 ],
        [ 19, 1, 17 ],
        [ 10, 20, 8 ],
        [ 2, 9, 14 ],
        [ 8, 9, 10 ],
        [ 5, 6, 19 ],
        [ 8, 8, 5 ],
        [ 5, 9, 20 ],
        [ 13, 18, 10 ],
        [ 20, 17, 6 ],
        [ 12, 13, 16 ],
        [ 4, 17, 17 ],
        [ 17, 4, 8 ],
        [ 10, 10, 17 ],
        [ 16, 18, 7 ]
    ],
    SlotSizes: [
        1,
        1,
        0,
        0,
        1,
        2,
        1,
        0,
        2,
        1,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        2,
        0
    ],
    Vehicles: [],
    Transactions: [],
};

/**
 * Vehicles: {
 *  plateNumber: '', //string
 *  size: 1, // 0, 1, 2 for small, medium, and large respectively
 * }
 * Transactions: {
 *  vehicleId: 12, // int index for vehicle
 *  slot: 15, // int index for slot
 *  startTime: new Date('2024-02-15T05:05:37.081Z'), // date object
 *  endTime: null, // date object or null
 *  parentTransaction: 12 // int index for transaction this one continues or null
 * }
 */

class MockDataModel extends DataModel {
    #table = [];
    constructor(tableName) {
        super(tableName);
        this.#table = _.get(data, this.tableName);
    }
    get(filters) {
        const result = [];
        _.forEach(this.#table, (row, index) => {
            if (!_.isNil(row) && _.isMatch(row, filters)) {
                result.push({ id: index, data: _.cloneDeep(row) });
            }
        })
        return result;
    }
    getById(id) {
        return !_.isNil(this.#table[id]) ? { id, data: _.cloneDeep(this.#table[id]) } : null;
    }
    add(data) {
        data = _.cloneDeep(data);
        this.#table.push(data);
        return { id: this.#table.length - 1, data: _.cloneDeep(data) };
    }
    update(data, filter) {
        const affectedData = _.map(
            this.get(filter),
            ({id}) => ({id, data})
        );
        _.forEach(({id, data}) => _.set(this.#table, id, data));
        return affectedData;
    }
    updateById(data, id) {
        if (_.isNil(this.#table[id])) {
            throw new Error('ID not found');
        }
        _.set(this.#table, id, data);
        return { id, data: _.cloneDeep(this.#table[id]) };
    }
    delete(filter) {
        const deletedRows = this.get(filter);
        _.forEach(deletedRows, ({id}) => _.unset(this.#table, id));
        return deletedRows;
    }
    deleteById(id) {
        const deletedRow = this.getById(id);
        _.unset(this.#table, deletedRow.id);
        return deletedRow;
    }
}

class MockDataSource extends DataSource {
    getModel(tableName) {
        if (!_.has(data, tableName)) {
            throw new Error('Table not found');
        }
        return new MockDataModel(tableName);
    }
}

module.exports = MockDataSource;