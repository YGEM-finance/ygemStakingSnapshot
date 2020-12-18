const axios = require("axios");
var fs = require('fs');

async function getStakerInfo() {
    try {
        let ContractAddress = "0x0afdf238d10f2D617cbD4eceb9CDdf2B64C2CA2c";
        let snapshotTimeStamp = "1607943122"; //2020-12-18-4-55-35 pm GMT

        const response = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokentx&address=${ContractAddress}&apikey=WIKDHW4267QM5Z2HCUVKQ2N81B6U4FEZWK`);
        let stakeInfo = [0, '0'];
        
        const stakingEventsArr = response.data.result;
        
        let fullDataBeforeSnapshot = [];
        stakingEventsArr.forEach(element => {
            if (parseInt(element.timeStamp) <= parseInt(snapshotTimeStamp)) {
                fullDataBeforeSnapshot.push(element);
            }
        });

        fs.writeFile('fullDataBeforeSnapshot.json', JSON.stringify(fullDataBeforeSnapshot), function (err) {
            if (err) return console.log(err);
            console.log('fullDataBeforeSnapshot.json created.');
          });
          
        console.log(`stakeAmount: ${stakeInfo[0]}\nlastStakeDate:${stakeInfo[1]} `);

    } catch (error) {
        console.error(error);
    }
}

getStakerInfo();