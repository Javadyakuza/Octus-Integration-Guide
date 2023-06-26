const { ethers } = require("hardhat");

export async function findMVAlienTransfer(txHash: string) {
  // event abi
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
  let events = [];

  await ethers.provider.getTransactionReceipt(txHash).then(res => {
    for (var log in res?.logs) {
      let logTopic = [res?.logs[log].topics[0]];
      let args = { topics: logTopic, data: res?.logs[log].data };
      if (abi.parseLog(args).name == "AlienTransfer") {
        events.push(abi.parseLog(args));
      }
    }
  });
}

// export async function findMVNativeTransfer(txHash: string): Promise<any[]> {
//   // event abi
//   let abi = new ethers.Interface([
//     `event NativeTransfer(
//       int8 native_wid,
//       uint256 native_addr,
//       uint128 amount,
//       int8 recipient_wid,
//       uint256 recipient_addr,
//       uint value,
//       uint expected_evers,
//       bytes payload
//   );`,
//   ]);
//   let events: any[] = [];

//   await ethers.provider.getTransactionReceipt(txHash).then(res => {
//     for (var log in res?.logs) {
//       let logTopic = [res?.logs[log].topics[0]];
//       let args = { topics: logTopic, data: res?.logs[log].data };
//       if (abi.parseLog(args).name == "NativeTransfer") {
//         events.push(abi.parseLog(args));
//       }
//     }
//     return [events];
//   });
// }

// interface NativeTransferEvent {
//   native_wid: number;
//   native_addr: string;
//   amount: ethers.BigNumber;
//   recipient_wid: number;
//   recipient_addr: string;
//   value: ethers.BigNumber;
//   expected_evers: ethers.BigNumber;
//   payload: string;
// }

export async function findMVNativeTransfer(txHash: string): Promise<any[] | null> {
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
  );`,
  ]);
  try {
    const txReceipt = await ethers.provider.getTransactionReceipt(txHash);
    if (!txReceipt) {
      throw new Error("Transaction receipt not found");
    }

    const abi = await ethers.getContractInterface(txReceipt.to!);
    const logs = txReceipt.logs
      .map(log => {
        try {
          return abi.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null) as NativeTransferEvent[];

    const nativeTransferEvent = logs.find(log => log.name === "NativeTransfer");
    return nativeTransferEvent ?? null;
  } catch (e) {
    console.error(`Error fetching NativeTransfer event: ${e.message}`);
    throw e;
  }
}
