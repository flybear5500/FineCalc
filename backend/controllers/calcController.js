
const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  


module.exports.calcFine = async(req, res, next) => {
    try {
    
        const fileName = await checkCSVExists('././public'); 
        if (!fileName) {
            return res.json({ existcsv: false });
        }
        else
        {
            const key = req.query.key.toLowerCase();

            const stream = fs.createReadStream(`././public/${fileName}`)
            .pipe(csvParser())
            .on('data', (data) => {
                let address = data["﻿Address 1"].toLowerCase();
                if(address.includes(key)){
                    let columnD = data["Largest Property Use Type - Gross Floor Area (ft²)"];
                    if((25000 - columnD) > 0){
                        res.json({result: false});
                    }
                    else
                    {
                        let columnH = data["Net Emissions (Metric Tons CO2e)"];
                        let columnI = data["Avoided Emissions - Onsite and Offsite Green Power (Metric Tons CO2e)"];
                        let actualEmissions = columnH - columnI;
                        let allowedEmissions = columnD * 0.00675;
                        let fineAmount = 0;
                        if(actualEmissions > allowedEmissions){
                            fineAmount = (actualEmissions - allowedEmissions)*268;
                        }
                        let columnE = data["Natural Gas Use (therms)"];
                        let columnF = data["Electricity Use - Grid Purchase (kWh)"];
                        let columnJ = data["Water Use (All Water Sources) (kgal)"];
                        
                        res.json({
                            existcsv: true,
                            result: true,
                            actualEmissions: actualEmissions.toFixed(2),
                            allowedEmissions: allowedEmissions.toFixed(2),
                            fineAmount: fineAmount.toFixed(2),
                            colE: columnE,
                            colF: columnF,
                            colJ: columnJ,
                        });
                    }

                    stream.destroy(); 
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
            });
        }
        
    } catch (ex) {
        next(ex);
    }
};

module.exports.calcAllAddress = async(req, res, next) => {
    try {

        const fileName = await checkCSVExists('././public'); 
        if (!fileName) {
            return res.json({ existcsv: false });
        }
        else{
            const csvWriter = createCsvWriter({
                path: '././public/Fine/fines.csv',
                header: [
                    { id: 'address', title: 'Address' },
                    { id: 'city', title: 'City'},
                    { id: 'postalCode', title: 'Postal Code' },
                    { id: 'fineAmount', title: 'Fine Amount' },
                    // add more columns as you need
                ]
            });
        
            let records = [];
        
            fs.createReadStream(`././public/${fileName}`)
            .pipe(csvParser())
            .on('data', (data) => {
                let address = data["﻿Address 1"];
                
                let columnD = data["Largest Property Use Type - Gross Floor Area (ft²)"];
                if((25000 - columnD) <= 0){
                    let columnH = data["Net Emissions (Metric Tons CO2e)"];
                    let columnI = data["Avoided Emissions - Onsite and Offsite Green Power (Metric Tons CO2e)"];
                    let calculatedSum = columnH - columnI;
                    let calculatedEmissions = columnD * 0.00675;
                    let fineAmount = 0;
                    if(calculatedEmissions > calculatedSum){
                        fineAmount = (calculatedEmissions - calculatedSum)*268;
                    }
    
                    // Add to records if fineAmount > 0
                    if(fineAmount > 0) {
                        records.push({
                            address: address,
                            city: data["City"],
                            postalCode: data["Postal Code"],
                            fineAmount: fineAmount,
                            // add more data as you need
                        });
                    }
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
        
                // Write to the csv file
                csvWriter
                .writeRecords(records)
                .then(()=> {
                    console.log('The CSV file was written successfully');
    
                    // After the file is written, send the file to the client
                    res.download('././public/Fine/fines.csv'); // This will start file download
                });
    
            });
        }
        
    } catch (ex) {
        next(ex);
    }
}

const checkCSVExists = (dir) => {
    const csvFiles = fs.readdirSync(dir).filter(fn => fn.endsWith('.csv'));
    return csvFiles.length ? csvFiles[0] : null;
}

module.exports.getAddress = async(req, res, next) => {
    try {

        const fileName = await checkCSVExists('././public'); 
        if (!fileName) {
            return res.json({ existcsv: false });
        }
        else
        {
            const key = req.query.key.toLowerCase();

            let results = [];

            fs.createReadStream(`././public/${fileName}`)
            .pipe(csvParser())
            .on('data', (data) => {
                let address = data["﻿Address 1"].toLowerCase();
                if(address.includes(key)){
                    results.push(address);
                }
            })
            .on('end', () => {
                res.json({ result: results, existcsv: true})
            });
        }
    } catch (ex) {
        next(ex);
    }
};                                                                                                                                                                                                                                                          