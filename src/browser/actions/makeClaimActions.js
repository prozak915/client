import { createActions } from 'spunky';
import { api } from '@cityofzion/neon-js';

import generateDAppActionId from './generateDAppActionId';

export const ID = 'claim';

const claimGas = async ({ net, address, wif }) => {
  const config = {
    net,
    address,
    privateKey: wif
  };

  const { response: { result, txid } } = await api.claimGas(config, api.neoscan);

  if (!result) {
    throw new Error('Claim failed.');
  }

  return txid;
};

export default function makeClaimActions(sessionId, requestId, call = claimGas) {
  const id = generateDAppActionId(sessionId, `${ID}-${requestId}`);

  return createActions(id, ({ net, address, wif }) => () => {
    return call({ net, address, wif });
  });
}
