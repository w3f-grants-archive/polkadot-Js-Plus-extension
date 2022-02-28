// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

import type { Balance } from '@polkadot/types/interfaces';
import type { ThemeProps } from '../../../extension-ui/src/types';

import { Grid, Skeleton } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import { ChainInfo } from '../util/plusTypes';
import { amountToHuman } from '../util/plusUtils';

export interface Props {
  balance: Balance | bigint | string | number | null;
  chainInfo: ChainInfo;
  align?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
  title: string;
  decimalDigits?: number;
}

function GBalance({ align = 'right', balance, chainInfo, decimalDigits, title }: Props): React.ReactElement<Props> {
  return (
    <Grid item sx={{ padding: '0px 40px 10px', textAlign: align }} xs={12}>
      {title}:{' '}
      {balance
        ? <>
          {Number(amountToHuman(balance.toString(), chainInfo.decimals, decimalDigits)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: decimalDigits})}{' '}{chainInfo.coin}
        </>
        : <Skeleton sx={{ display: 'inline-block', fontWeight: 'bold', width: '70px' }} />
      }
    </Grid>
  );
}

export default styled(GBalance)(({ theme }: ThemeProps) => `
      background: ${theme.accountBackground};
      border: 1px solid ${theme.boxBorderColor};
      box-sizing: border-box;
      border-radius: 4px;
      margin-bottom: 8px;
      position: relative;
`);
