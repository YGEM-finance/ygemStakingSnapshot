const axios = require("axios");

async function getStakerInfo() {
    try {
        let ContractAddress = "0x0afdf238d10f2D617cbD4eceb9CDdf2B64C2CA2c";
        let snapshotTimeStamp;

        const response = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokentx&address=${ContractAddress}&apikey=WIKDHW4267QM5Z2HCUVKQ2N81B6U4FEZWK`);
        let stakeInfo = [0, '0'];
        const stakingEventsArr = response.data.result;

        stakingEventsArr.forEach(element => {
            console.log(element);

        });
        console.log(`stakeAmount: ${stakeInfo[0]}\nlastStakeDate:${stakeInfo[1]} `);

    } catch (error) {
        console.error(error);
    }
}

getStakerInfo();