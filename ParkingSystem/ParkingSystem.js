const _ = require('lodash');
const moment = require('moment');

const hourInMs = 1000 * 60 * 60;
const dayInMs = 24 * hourInMs;

class ParkingSystem {
    #slotEntranceDistancesModel = null;
    #slotSizesModel = null;
    #slotSizePricingModel = null;
    #vehiclesModel = null;
    #transactionsModel = null;

    constructor(dataSource, flatRateCharge = 40, flatRateHours = 3, fullDayCharge = 5000) {
        this.flatRateCharge = flatRateCharge;
        this.flatRateHours = flatRateHours;
        this.fullDayCharge = fullDayCharge;
        this.#slotEntranceDistancesModel = dataSource.getModel('SlotEntranceDistances');
        this.#slotSizesModel = dataSource.getModel('SlotSizes');
        this.#slotSizePricingModel = dataSource.getModel('SlotSizePricings');
        this.#vehiclesModel = dataSource.getModel('Vehicles');
        this.#transactionsModel = dataSource.getModel('Transactions');
    }

    parkVehicle(plateNumber, size, parkTime) {
        let id = this.#getVehicleID(plateNumber);

        if (!id) {
            id = this.#registerVehicle(plateNumber, size);
        }

        const slotId = this.#findAvailableSlot(size);

        if (!slotId) {
            throw new Error('No more available parking slot');
        }

        const transaction = this.#recordVehicleParking(id, slotId, parkTime);
        return {
            transactionId: transaction.id,
            slotId,
            parkTime
        };
    }

    #getVehicleID(plateNumber) {
        // TODO
    }

    #registerVehicle(plateNumber, size) {
        // TODO
    }

    #findAvailableSlot(size) {
        // TODO
    }

    #recordVehicleParking(vehicleId, slotId) {
        // TODO
    }

    unparkVehicle(plateNumber, unparkTime) {
        let id = this.#getVehicleID(plateNumber);

        if (!id) {
            id = this.#registerVehicle(plateNumber, size);
        }

        const transactionChain = this.#getRecentTransactionChain(id);
        const lastTransaction = _.first(transactionChain);
        this.#recordVehicleUnparking(lastTransaction.id, unparkTime);
        const { paidAmount, totalCost } = this.#calculateCost(transactionChain, unparkTime);

        return {
            transactionId: lastTransaction.id,
            slotId: lastTransaction.data.slot,
            parkTime: lastTransaction.data.startTime,
            endTime: unparkTime,
            totalCost,
            paidAmount,
            chargeAmount: Math.max(0, totalCost - paidAmount)
        };
    }
    
    #getRecentTransactionChain(id) {
        // TODO
    }

    #calculateCost(transactionChain, unparkTime) {
        let totalCost = 0;
        const firstTransaction = _.last(transactionChain);
        const lastTransaction = _.first(transactionChain);
        let coveredDurationMs = 0;
        const startTimeMoment = moment(firstTransaction.data.startTime);
        const totalDurationMs = moment(unparkTime).diff(startTimeMoment);

        while (totalDurationMs - coveredDurationMs >= dayInMs) {
            totalCost += this.fullDayCharge;
            coveredDurationMs += dayInMs;
        }

        if (coveredDurationMs === 0) {
            coveredDurationMs = this.flatRateHours * hourInMs;
            totalCost = this.flatRateCharge;
        }

        for (let i = transactionChain.length - 1; i >= 0; i--) {
            const transaction = transactionChain[i];
            const transactionEndTime = transaction.data.endTime ?? unparkTime;
            const hoursSoFar = moment(transactionEndTime).diff(startTimeMoment);
            
            if () {
                
            }
        }
    }

    #recordVehicleUnparking(transactionId, unparkTime) {
        // TODO
    }
}

module.exports = ParkingSystem;