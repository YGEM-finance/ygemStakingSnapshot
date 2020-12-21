const axios = require("axios");
var fs = require('fs');

async function getStakerInfo() {
    try {
        let ContractAddress = "0x0afdf238d10f2D617cbD4eceb9CDdf2B64C2CA2c";
        let snapshotTimeStamp = "1608310926";

        const response = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokentx&address=${ContractAddress}&apikey=WIKDHW4267QM5Z2HCUVKQ2N81B6U4FEZWK`);

        const stakingEventsArr = response.data.result;

        let historyStakers = [];
        let fullDataBeforeSnapshot = [];
        stakingEventsArr.forEach(eventData => {
            if (parseInt(eventData.timeStamp) <= parseInt(snapshotTimeStamp)) {
                fullDataBeforeSnapshot.push(eventData);

                if (!historyStakers.includes(eventData.to) && eventData.to != ContractAddress) {
                    historyStakers.push(eventData.to);
                }
                if (!historyStakers.includes(eventData.from) && eventData.from != ContractAddress) {
                    historyStakers.push(eventData.from);
                }
            }
        });

        fs.writeFile('fullDataBeforeSnapshot.json', JSON.stringify(fullDataBeforeSnapshot), function (err) {
            if (err) return console.log(err);
            console.log('fullDataBeforeSnapshot.json created.');
        });

        fs.writeFile('historyStakers.json', JSON.stringify(historyStakers), function (err) {
            if (err) return console.log(err);
            console.log('historyStakers.json created.');
        });

        let stakesInfo = [];

        historyStakers.forEach(address => {
            let addressStake = { staker: address, amount: 0 };
            fullDataBeforeSnapshot.forEach(element => {
                if (element.from == address) {
                    //console.log("Stake");
                    //console.log(element);
                    addressStake.amount += parseInt(element.value);

                    addressStake.lastStakeDate = element.timeStamp;
                }
                if (element.to == address) {
                    //console.log("UNStake");
                    //console.log(element);
                    addressStake.amount = 0;
                    addressStake.lastStakeDate = "0";
                }
            });
            if(addressStake.amount != 0)
                stakesInfo.push(addressStake);
        });

        fs.writeFile('YgemStakeSnapshot.json', JSON.stringify(stakesInfo), function (err) {
            if (err) return console.log(err);
            console.log('YgemStakeSnapshot.json created.');
        });
        console.log(stakesInfo);

    } catch (error) {
        console.error(error);
    }
}

getStakerInfo();