// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/extension-mocks/chrome';

import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';

import { Chain } from '../../../../../extension-chains/src/types';
import getChainInfo from '../../../util/getChainInfo';
import { BalanceType, MyPoolInfo } from '../../../util/plusTypes';
import { amountToHuman, amountToMachine } from '../../../util/plusUtils';
import { pool, poolsMembers, stakingConsts, state, validatorsIdentities, validatorsList } from '../../../util/test/testHelper';
import ConfirmStaking from './ConfirmStaking';

jest.setTimeout(60000);
ReactDOM.createPortal = jest.fn((modal) => modal);

let api: ApiPromise | undefined;
let decimals: number | undefined = 12;
let coin: string | undefined;
const validAmountToStake = 10;
const availableBalanceInHuman = 15; // WND
const balanceInfo: BalanceType = {
  available: amountToMachine(availableBalanceInHuman.toString(), decimals),
  coin: 'WND',
  decimals: decimals,
  total: amountToMachine(availableBalanceInHuman.toString(), decimals)
};
const chain: Chain = {
  name: 'westend'
};
const staker = {
  address: '5DaBEgUMNUto9krwGDzXfSAWcMTxxv7Xtst4Yjpq9nJue7tm',
  balanceInfo: balanceInfo,
  chain: 'westend',
  name: 'Amir khan'
};

const setState = () => null;
const setConfirmStakingModalOpen = () => null;

let amount: BN = new BN(String(amountToMachine(validAmountToStake.toString(), decimals)));
const amountToStakeInHuman = amountToHuman(amount.toString(), decimals);

describe('Testing ConfirmStaking component', () => {
  beforeAll(async () => {
    const chainInfo = await getChainInfo('westend');

    api = chainInfo?.api;
    decimals = chainInfo?.decimals;
    coin = chainInfo?.coin;
  });

  test('when state is joinPool', async () => {
    const joinPool: MyPoolInfo = pool(state[13]);

    const { queryAllByText, queryByLabelText, queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={amount}
        api={api}
        basePool={joinPool}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={joinPool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true} // join pool
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[13]}
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(joinPool.member.points.toString(), decimals);
    const confirmButton = queryAllByText('Confirm')[1];
    const index = joinPool.poolId.toString();
    const mayPoolBalance = joinPool?.ledger?.active ?? joinPool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('JOIN POOL')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual(`${amountToStakeInHuman}${coin}`);
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText(`${currentlyStaked} ${coin}`)).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryByText(`${Number(currentlyStaked) + Number(amountToStakeInHuman)} ${coin}`)).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('More')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(joinPool.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(joinPool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(joinPool.bondedPool.memberCounter)).toBeTruthy();

    expect(queryByLabelText('Password')).toBeTruthy();
    fireEvent.change(queryByLabelText('Password'), { target: { value: 'invalidPassword' } });
    expect(queryByText('Please enter the account password')).toBeTruthy();
    fireEvent.click(confirmButton);
    await waitFor(() => queryByText('Password is not correct'), { timeout: 5000 });
  });

  test('when state is createPool', () => {
    const createPool: MyPoolInfo = pool(state[12]);

    const { queryByLabelText, queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={amount}
        api={api}
        basePool={createPool}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={createPool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true} // join pool
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[12]}
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(createPool.member.points.toString(), decimals);
    const index = createPool.poolId.toString();
    const mayPoolBalance = createPool?.ledger?.active ?? createPool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('CREATE POOL')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual(`${amountToStakeInHuman}${coin}`);
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText(`${currentlyStaked} ${coin}`)).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryByText(`${Number(currentlyStaked) + Number(amountToStakeInHuman)} ${coin}`)).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(createPool.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(createPool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(createPool.bondedPool.memberCounter)).toBeTruthy();
  });

  test('when state is bondExtra', () => {
    const bondPool: MyPoolInfo = pool(state[11]);

    const { queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={amount}
        api={api}
        basePool={bondPool}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={bondPool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true} // join pool
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[11]}
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(bondPool.member.points.toString(), decimals);
    const index = bondPool.poolId.toString();
    const mayPoolBalance = bondPool?.ledger?.active ?? bondPool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('STAKING OF')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual(`${amountToStakeInHuman}${coin}`);
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText(`${currentlyStaked} ${coin}`)).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryByText(`${Number(currentlyStaked) + Number(amountToStakeInHuman)} ${coin}`)).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('More')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(bondPool.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(bondPool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(bondPool.bondedPool.memberCounter)).toBeTruthy();
  });

  test('when state is bondExtraRewards', () => {
    const bondExtraRewardPool: MyPoolInfo = pool(state[10]);

    amount = bondExtraRewardPool.myClaimable; // bondExtraReward
    const { debug, queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={amount}
        api={api}
        basePool={bondExtraRewardPool}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={bondExtraRewardPool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true} // join pool
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[10]}
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(bondExtraRewardPool.member.points.toString(), decimals);
    const totalStaked = amountToHuman(((new BN(bondExtraRewardPool.member.points)).add(amount)).toString(), decimals);
    const index = bondExtraRewardPool.poolId.toString();
    const mayPoolBalance = bondExtraRewardPool?.ledger?.active ?? bondExtraRewardPool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('STAKING OF')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual(`${amountToHuman(amount.toString(), decimals)}${coin}`);
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText(`${currentlyStaked} ${coin}`)).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryByText(`${totalStaked} ${coin}`)).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('More')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(bondExtraRewardPool.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(bondExtraRewardPool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(bondExtraRewardPool.bondedPool.memberCounter)).toBeTruthy();
  });

  test('when state is withdrawClaimable', () => {
    const withdrawClaimablePool: MyPoolInfo = pool(state[9]);

    amount = withdrawClaimablePool.myClaimable;

    const { debug, queryAllByText, queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={amount}
        api={api}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={withdrawClaimablePool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true}
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[9]}
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(withdrawClaimablePool.member.points.toString(), decimals);
    const index = withdrawClaimablePool.poolId.toString();
    const mayPoolBalance = withdrawClaimablePool?.ledger?.active ?? withdrawClaimablePool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('CLAIM')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual(`${amountToHuman(amount.toString(), decimals)}${coin}`);
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryAllByText(`${currentlyStaked} ${coin}`)).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('More')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(withdrawClaimablePool?.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(withdrawClaimablePool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(withdrawClaimablePool.bondedPool.memberCounter)).toBeTruthy();
  });

  test.skip('when state is withdrawUnbound', () => {

    // TODO
    // const withdrawUnboundPool: MyPoolInfo = pool(state[6]);

    // amount = withdrawUnboundPool.myClaimable;  // withdrawUnbound

    // const { queryAllByText, queryByTestId, queryByText } = render(
    //   <ConfirmStaking
    //     amount={amount}
    //     api={api}
    //     chain={chain}
    //     nominatedValidators={validatorsList}
    //     pool={withdrawUnboundPool}
    //     poolsMembers={poolsMembers}
    //     selectedValidators={validatorsList}
    //     setConfirmStakingModalOpen={setConfirmStakingModalOpen}
    //     setState={setState}
    //     showConfirmStakingModal={true}
    //     staker={staker}
    //     stakingConsts={stakingConsts}
    //     state={state[6]}
    //     validatorsIdentities={validatorsIdentities}
    //   />
    // );
  });

  test('when state is editPool', () => {
    const justAPool: MyPoolInfo = pool('');
    const editPool: MyPoolInfo = pool('', true, true); // metaData and roles going to change

    const { queryAllByText, queryByTestId, queryByText } = render(
      <ConfirmStaking
        amount={new BN('0')}
        api={api}
        basePool={editPool}
        chain={chain}
        nominatedValidators={validatorsList}
        pool={justAPool}
        poolsMembers={poolsMembers}
        selectedValidators={validatorsList}
        setConfirmStakingModalOpen={setConfirmStakingModalOpen}
        setState={setState}
        showConfirmStakingModal={true}
        staker={staker}
        stakingConsts={stakingConsts}
        state={state[14]} // edit pool
        validatorsIdentities={validatorsIdentities}
      />
    );

    const currentlyStaked = amountToHuman(justAPool.member.points.toString(), decimals);
    const index = justAPool.poolId.toString();
    const mayPoolBalance = justAPool?.ledger?.active ?? justAPool?.bondedPool?.points;
    const staked = api.createType('Balance', mayPoolBalance).toHuman();

    expect(queryByText('EDIT POOL')).toBeTruthy();
    expect(queryByTestId('amount')?.textContent).toEqual('');
    expect(queryByText('Currently staked')).toBeTruthy();
    expect(queryByText('Total staked')).toBeTruthy();
    expect(queryAllByText(`${Number(currentlyStaked)} ${coin}`).length === 2).toBeTruthy();
    expect(queryByText('Fee')).toBeTruthy();

    expect(queryByText('Pool')).toBeTruthy();
    expect(queryByText('More')).toBeTruthy();
    expect(queryByText('Index')).toBeTruthy();
    expect(queryByText(index)).toBeTruthy();
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText(justAPool.metadata)).toBeTruthy();
    expect(queryByText('State')).toBeTruthy();
    expect(queryByText(justAPool.bondedPool.state)).toBeTruthy();
    expect(queryByText('Staked')).toBeTruthy();
    expect(queryByText(staked)).toBeTruthy();
    expect(queryByText('Members')).toBeTruthy();
    expect(queryByText(justAPool.bondedPool.memberCounter)).toBeTruthy();
  });
});
