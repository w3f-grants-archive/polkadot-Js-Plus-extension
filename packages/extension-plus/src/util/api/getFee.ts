// // Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// // SPDX-License-Identifier: Apache-2.0
// /* eslint-disable header/header */

// import type { Chain } from '@polkadot/extension-chains/types';

// import { AddressOrPair } from '@polkadot/api/types';
// import { Balance } from '@polkadot/types/interfaces';

// import getChainInfo from '../getChainInfo';

// export default async function getFee(
//   _senderKeyring: AddressOrPair,
//   _receiverAddress: string,
//   _amount: bigint, _chain: Chain | null | undefined): Promise<Balance> {

//   const { api } = await getChainInfo(_chain);
//   const transferValue = _amount;// * BigInt(10 ** decimals);
//   const info = await api.tx.balances
//     .transfer(_receiverAddress, transferValue)
//     .paymentInfo(_senderKeyring);

//   console.log(`
//   transferValue=${transferValue},
//   weight=${info.weight.toString()},
//   partialFee=${info.partialFee},
//   partialFeeInHuman=${info.partialFee.toHuman()}
// `);

//   return info.partialFee;
// }