import { Balance, Transaction } from '../../src/base/types';
import {
  mapBlockCypherBalance,
  mapBlockCypherTransactions,
} from '../../src/provider/blockcypher/bitcoin/blockcypher-bitcoin-mapper';
import {
  BlockCypherBalance,
  BlockCypherBalanceFull,
} from '../../src/provider/blockcypher/bitcoin/blockcypher-bitcoin-types';

describe('Test Blockcypher Bitcoin', () => {
  test('Mapper Blockcypher Balance Works', () => {
    const transformed = mapBlockCypherBalance(blockCypherBalanceMock);

    expect(transformed).toEqual(expect.objectContaining(expectedBalance));
  });

  test('Mapper Blockcypher Transaction Works', () => {
    const transformed = mapBlockCypherTransactions(blockCypherTransactionFull);

    expect(transformed).toEqual(expect.arrayContaining(expectedTransaction));
  });
});

const blockCypherTransactionFull: BlockCypherBalanceFull = {
  address: '',
  total_received: 0,
  total_sent: 0,
  balance: 0,
  unconfirmed_balance: 0,
  final_balance: 0,
  n_tx: 0,
  unconfirmed_n_tx: 0,
  final_n_tx: 0,
  txs: [
    {
      block_hash: '',
      block_height: 0,
      block_index: 0,
      hash: '',
      addresses: [],
      total: 0,
      fees: 0,
      size: 0,
      vsize: 0,
      preference: '',
      confirmed: new Date(0),
      received: new Date(0),
      ver: 0,
      double_spend: false,
      vin_sz: 0,
      vout_sz: 0,
      confirmations: 0,
      confidence: 0,
      inputs: [
        {
          prev_hash: '',
          output_index: 0,
          script: '',
          output_value: 0,
          sequence: 0,
          addresses: [],
          script_type: '',
          age: 0,
        },
      ],
      outputs: [
        {
          value: 0,
          script: '',
          addresses: [''],
          script_type: '',
        },
      ],
      lock_time: 0,
      hex: undefined,
      witness_hash: undefined,
    },
  ],
};

const blockCypherBalanceMock: BlockCypherBalance = {
  total_received: 0,
  total_sent: 0,
  unconfirmed_balance: 0,
  final_balance: 0,
  balance: 0,
  n_tx: 0,
  unconfirmed_n_tx: 0,
  final_n_tx: 0,
};

const expectedBalance: Balance = {
  incoming: 0,
  outgoing: 0,
};

const expectedTransaction: Transaction[] = [
  {
    blockNumber: 0,
    fee: 0,
    hash: '',
    hex: '',
    index: 0,
    inputs: [
      {
        prevout: {
          hash: '',
          index: 0,
        },
        sequence: 0,
        script: '',
        scriptType: '',
      },
    ],
    locktime: 0,
    outputs: [
      {
        value: 0,
        script: '',
        address: '',
      },
    ],
    size: 0,
    time: 0,
    version: 0,
    vsize: 0,
    witnessHash: '',
    total: 0,
  },
];
