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
        const { paidAmount, totalCost } = this.#calculateCost(transactionChain);
        const [latestTransaction] = transactionChain;
        this.#recordVehicleUnparking(latestTransaction.id, unparkTime);

        return {
            transactionId: latestTransaction.id,
            slotId: latestTransaction.data.slot,
            parkTime: latestTransaction.data.startTime,
            endTime: unparkTime,
            totalCost,
            paidAmount,
            chargeAmount: Math.max(0, totalCost - paidAmount)
        };
    }
    
    #getRecentTransactionChain(id) {
        // TODO
    }

    #calculateCost(transactionChain) {
        // TODO
    }

    #recordVehicleUnparking(transactionId, unparkTime) {
        // TODO
    }
}

module.exports = ParkingSystem;