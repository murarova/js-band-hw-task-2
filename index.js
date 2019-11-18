function getTruckIdsCallback(callback) {
    setTimeout(() => {
        callback([1, 2, 5, 9, 67]);
    }, 1000);
}

function getTruckIds() {
    return new Promise(resolve => {
        getTruckIdsCallback(result => resolve(result));
    });
}

function getTruckByIdCallback(id, callback) {
    setTimeout(() => {
        const isError = Math.ceil(Math.random() * 1000) < 100;
        if (isError) {
            return callback(undefined, "Internal error");
        }
        callback({
            id: id,
            model: `truck ${id}`
        });
    });
}

function getTruckById(id) {
    return new Promise((resolve, reject) => {
        getTruckByIdCallback(id, (result, err) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function getTruckListCallback(callback) {
    getTruckIds()
        .then(truckIds => {
            let truckList = [];

            truckIds.forEach(id => {
                getTruckById(id)
                    .then(truck => truckList.push(truck))
                    .catch(err => {
                        getTruckById(id)
                            .then(truck => truckList.push(truck))
                            .catch(err => callback(undefined, err));
                    });
            });
            return truckList;
        })
        .then(truckList => callback(truckList));
}

const cb = (data, err) => {
    if (err) return console.error(err);
    console.log(data);
};

//check result
// getTruckListCallback(cb);

function getTruckListPromise() {
    return new Promise((resolve, reject) => {
        getTruckIds()
            .then(truckIds => {
                let truckList = [];

                truckIds.forEach(id => {
                    getTruckById(id)
                        .then(truck => truckList.push(truck))
                        .catch(err => {
                            getTruckById(id)
                                .then(truck => truckList.push(truck))
                                .catch(err => console.error(`Truck ${id} not found`, err));
                        });
                });
                return truckList;
            })
            .then(truckList => resolve(truckList))
            .catch(err => reject(err));
    });
}

// check result

// getTruckListPromise()
//   .then(data => console.log(data))
//   .catch(err => console.log(err));

async function getTruckListAsynAwait() {
    try {
        let truckList = [];

        const truckIds = await getTruckIds();

        truckIds.forEach(async id => {
            try {
                const truck = await getTruckById(id);
                truckList.push(truck);
            } catch (err) {
                try {
                    const truck = await getTruckById(id);
                    truckList.push(truck);
                } catch (err) {
                    console.error(`Truck ${id} not found`, err);
                }
            }
        });
        return truckList;
    } catch (err) {
        console.error(err);
    }
}

// check result

// getTruckListAsynAwait()
//   .then(data => console.log(data))
//   .catch(err => console.log(err));