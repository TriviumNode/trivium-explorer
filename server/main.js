// Server entry point, imports all server code

import '/imports/startup/server';
import '/imports/startup/both';
// import moment from 'moment';
// import '/imports/api/blocks/blocks.js';

SYNCING = false;
TXSYNCING = false;
SSSYNCING = false;
CTSYNCING = false;
SCTSYNCING = false;
COUNTMISSEDBLOCKS = false;
COUNTMISSEDBLOCKSSTATS = false;
RPC = Meteor.settings.remote.rpc;
LCD = Meteor.settings.remote.lcd;
timerBlocks = 0;
timerTransactions = 0;
timerContracts = 0;
timerEnigma = 0;
timerTest = 0;
timerChain = 0;
timerConsensus = 0;
timerProposal = 0;
timerProposalsResults = 0;
timerMissedBlock = 0;
timerDelegation = 0;
timerAggregate = 0;

const DEFAULTSETTINGS = '/default_settings.json';

updateChainStatus = () => {
    Meteor.call('chain.updateStatus', (error, result) => {
        if (error){
            console.log("updateStatus: "+error);
        }
        else{
            console.log("updateStatus: "+result);
        }
    })
}

updateBlock = () => {
    Meteor.call('blocks.blocksUpdate', (error, result) => {
        if (error){
            console.log("updateBlocks: "+error);
        }
        else{
            console.log("updateBlocks: "+result);
        }
    })
}

updateTransactions = () => {
    Meteor.call('Transactions.updateTransactions', (error, result) => {
        if (error){
            console.log("updateTransactions: "+error);
        }
        else{
            console.log("updateTransactions: "+result);
        }
    })
}

updateContracts = () => {
    Meteor.call('Contracts.updateContracts', (error, result) => {
        if (error) {
            console.log("updateContracts: " + error);
        }
        else {
            console.log("updateContracts: " + result);
        }
    })
}

showContracts = () => {
    Meteor.call('Contracts.showContracts', (error, result) => {
        if (error) {
            console.log("showContracts: " + error);
        }
        else {
            console.log("showContracts: " + result);
        }
    })
}

processContracts = () => {
    Meteor.call('SecretContracts.updateContracts', (error, result) => {
        if (error) {
            console.log("processContracts: " + error);
        }
        else {
            console.log("processContracts: " + result);
        }
    })
}

bridgeSync = () => {
    Meteor.call('SecretContracts.bridgeTokenSync', (error, result) => {
        if (error) {
            console.log("Bridge Sync: " + error);
        }
        else {
            console.log("Bridge Sync: " + result);
        }
    })
}

sswapSync = () => {
    Meteor.call('SecretContracts.sswapTokenSync', (error, result) => {
        if (error) {
            console.log("SecretSwap Sync Error: " + error);
        }
        else {
            console.log("SecretSwap Sync: " + result);
        }
    })
}



tokensCount = () => {
    Meteor.call('SecretContracts.tokensCount', (error, result) => {
        if (error) {
            console.log("Tokens: " + error);
        }
        else {
            console.log("Tokens: " + result);
        }
    })
}

test1 = () => {
    Meteor.call('Contracts.executions', "secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek", (error, result) => {
        if (error) {
            console.log("sSCRT Executions Error: " + error);
        }
        else {
            console.log("sSCRT Executions: " + result);
        }
    })
}

getConsensusState = () => {
    Meteor.call('chain.getConsensusState', (error, result) => {
        if (error){
            console.log("get consensus: "+error)
        }
    })
}

getProposals = () => {
    Meteor.call('proposals.getProposals', (error, result) => {
        if (error){
            console.log("get proposal: "+ error);
        }
        if (result){
            console.log("get proposal: "+result);
        }
    });
}

getProposalsResults = () => {
    Meteor.call('proposals.getProposalResults', (error, result) => {
        if (error){
            console.log("get proposals result: "+error);
        }
        if (result){
            console.log("get proposals result: "+result);
        }
    });
}

updateMissedBlocks = () => {
    Meteor.call('ValidatorRecords.calculateMissedBlocks', (error, result) =>{
        if (error){
            console.log("missed blocks error: "+ error)
        }
        if (result){
            console.log("missed blocks ok:" + result);
        }
    });
}

getDelegations = () => {
    Meteor.call('delegations.getDelegations', (error, result) => {
        if (error){
            console.log("get delegations error: "+ error)
        }
        else{
            console.log("get delegations ok: "+ result)
        }
    });
}

aggregateMinutely = () =>{
    // doing something every min
    Meteor.call('Analytics.aggregateBlockTimeAndVotingPower', "m", (error, result) => {
        if (error){
            console.log("aggregate minutely block time error: "+error)
        }
        else{
            console.log("aggregate minutely block time ok: "+result)
        }
    });

    Meteor.call('coinStats.getCoinStats', (error, result) => {
        if (error){
            console.log("get coin stats error: "+error);
        }
        else{
            console.log("get coin stats ok: "+result)
        }
    });
}

aggregateHourly = () =>{
    // doing something every hour
    Meteor.call('Analytics.aggregateBlockTimeAndVotingPower', "h", (error, result) => {
        if (error){
            console.log("aggregate hourly block time error: "+error)
        }
        else{
            console.log("aggregate hourly block time ok: "+result)
        }
    });
}

aggregateDaily = () =>{
    // doing somthing every day
    Meteor.call('Analytics.aggregateBlockTimeAndVotingPower', "d", (error, result) => {
        if (error){
            console.log("aggregate daily block time error: "+error)
        }
        else{
            console.log("aggregate daily block time ok: "+result)
        }
    });

    Meteor.call('Analytics.aggregateValidatorDailyBlockTime', (error, result) => {
        if (error){
            console.log("aggregate validators block time error:"+ error)
        }
        else {
            console.log("aggregate validators block time ok:"+ result);
        }
    })
}



Meteor.startup(function(){
    if (Meteor.isDevelopment){
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        import DEFAULTSETTINGSJSON from '../default_settings.json'
        Object.keys(DEFAULTSETTINGSJSON).forEach((key) => {
            if (Meteor.settings[key] == undefined) {
                console.warn(`CHECK SETTINGS JSON: ${key} is missing from settings`)
                Meteor.settings[key] = {};
            }
            Object.keys(DEFAULTSETTINGSJSON[key]).forEach((param) => {
                if (Meteor.settings[key][param] == undefined){
                    console.warn(`CHECK SETTINGS JSON: ${key}.${param} is missing from settings`)
                    Meteor.settings[key][param] = DEFAULTSETTINGSJSON[key][param]
                }
            })
        })
    }

    if (Meteor.settings.debug.startTimer){
        timerConsensus = Meteor.setInterval(function(){
            getConsensusState();
        }, Meteor.settings.params.consensusInterval);

        timerBlocks = Meteor.setInterval(function(){
            updateBlock();
        }, Meteor.settings.params.blockInterval);

        timerTransactions = Meteor.setInterval(function(){
            updateTransactions();
        }, Meteor.settings.params.transactionsInterval);

        if (Meteor.settings.public.modules.cosmwasm){
            timerContracts = Meteor.setInterval(function () {
                updateContracts();
                showContracts();
                processContracts();
                tokensCount();
                //bridgeSync();
            }, Meteor.settings.params.contractsInterval);
        }

        timerEnigma = Meteor.setInterval(function () {
            //bridgeSync();
            sswapSync();
        }, Meteor.settings.params.enigmaInterval);

        timerTest = Meteor.setInterval(function () {
            test1();
            tokensCount();
        }, Meteor.settings.params.testInterval);

        timerChain = Meteor.setInterval(function(){
            updateChainStatus();
        }, Meteor.settings.params.statusInterval);

        if (Meteor.settings.public.modules.gov) {
            timerProposal = Meteor.setInterval(function () {
                getProposals();
            }, Meteor.settings.params.proposalInterval);

            timerProposalsResults = Meteor.setInterval(function () {
                getProposalsResults();
            }, Meteor.settings.params.proposalInterval);
        }

        timerMissedBlock = Meteor.setInterval(function(){
            updateMissedBlocks();
        }, Meteor.settings.params.missedBlocksInterval);

        timerDelegation = Meteor.setInterval(function(){
            getDelegations();
        }, Meteor.settings.params.delegationInterval);

        timerAggregate = Meteor.setInterval(function(){
            let now = new Date();
            if ((now.getUTCSeconds() == 0)){
                aggregateMinutely();
            }

            if ((now.getUTCMinutes() == 0) && (now.getUTCSeconds() == 0)){
                aggregateHourly();
            }

            if ((now.getUTCHours() == 0) && (now.getUTCMinutes() == 0) && (now.getUTCSeconds() == 0)){
                aggregateDaily();
            }
        }, 1000)
    }
});
