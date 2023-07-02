import EventVoteData from "../../interfaces/voteData";
import { ethers } from "hardhat";
export async function buildNativeEventVoteData(txHash: string): Promise<any | null> {
  let abi = new ethers.Interface([
    `event NativeTransfer(
        int8 native_wid,
        uint256 native_addr,
        uint128 amount,
        int8 recipient_wid,
        uint256 recipient_addr,
        uint value,
        uint expected_evers,
        bytes payload
    )`,
  ]);
  const provider = new ethers.JsonRpcProvider("https://endpoints.omniatech.io/v1/bsc/mainnet/public");
  try {
    const txReceipt = await provider.getTransactionReceipt(txHash);
    if (!txReceipt) {
      throw new Error("Transaction receipt not found");
    }
    const logs = txReceipt.logs
      .map(log => {
        try {
          let abiArgs = { topics: [log.topics[0]], data: log.data };
          return { index: log.index, data: log.data, parsedLog: abi.parseLog(abiArgs) };
        } catch (e) {
          return null;
        }
      })
      .filter(log => log?.parsedLog !== null) as { index: number; data: string; parsedLog: any }[];
    console.log(logs);
    const log = logs.find(log => log.parsedLog.name === "NativeTransfer");
    const eventVoteData: EventVoteData = {
      eventTransaction: txReceipt.hash,
      eventIndex: log?.index!,
      eventData: log?.data!,
      eventBlockNumber: txReceipt.blockNumber,
      eventBlock: txReceipt.blockHash,
    };
    return eventVoteData;
  } catch (e) {
    console.error(`Error fetching NativeTransfer event: ${e}`);
    throw e;
  }
}
export async function buildAlienEventVoteData(txHash: string): Promise<any | null> {
  const provider = new ethers.JsonRpcProvider("https://endpoints.omniatech.io/v1/bsc/mainnet/public");
  let abi = new ethers.Interface([
    `event AlienTransfer(
        uint256 base_chainId,
        uint160 base_token,
        string name,
        string symbol,
        uint8 decimals,
        uint128 amount,
        int8 recipient_wid,
        uint256 recipient_addr,
        uint value,
        uint expected_evers,
        bytes payload
    )`,
  ]);
  try {
    const txReceipt = await provider.getTransactionReceipt(txHash);
    if (!txReceipt) {
      throw new Error("Transaction receipt not found");
    }
    const logs = txReceipt.logs
      .map(log => {
        try {
          let abiArgs = { topics: [log.topics[0]], data: log.data };
          return { index: log.index, data: log.data, parsedLog: abi.parseLog(abiArgs) };
        } catch (e) {
          return null;
        }
      })
      .filter(log => log?.parsedLog !== null) as { index: number; data: string; parsedLog: any }[];
    console.log(logs);
    const log = logs.find(log => log.parsedLog.name === "AlienTransfer");
    const eventVoteData: EventVoteData = {
      eventTransaction: txReceipt.hash,
      eventIndex: log?.index!,
      eventData: log?.data!,
      eventBlockNumber: txReceipt.blockNumber,
      eventBlock: txReceipt.blockHash,
    };
    return eventVoteData;
  } catch (e) {
    console.error(`Error fetching AlienTransfer event: ${e}`);
    throw e;
  }
}
