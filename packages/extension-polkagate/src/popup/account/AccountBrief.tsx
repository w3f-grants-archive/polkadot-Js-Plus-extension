// Copyright 2019-2022 @polkadot/extension-polkagate authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description
 * this component 
 * */

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Divider, Grid, Typography } from '@mui/material';
import React, { } from 'react';

import useTranslation from '../../../../extension-ui/src/hooks/useTranslation';
import { ShortAddress } from '../../components';

interface Props {
  accountName: string | undefined;
  formatted: string
}

export default function AccountBrief({ accountName, formatted }: Props): React.ReactElement<Props> {

  return (
    <Grid item textAlign='center'>
      <Grid alignItems='center' container justifyContent='center' spacing={1.2}>
        <Grid item>
          <Typography sx={{ fontSize: '24px', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: '36px' }}>
            {accountName}
          </Typography>
        </Grid>
        <Grid item>
          <VisibilityOutlinedIcon sx={{ fontSize: '22px', pt: '5px' }} />
        </Grid>
      </Grid>
      <ShortAddress address={formatted} addressStyle={{ fontSize: '11px', fontWeight: 400, letterSpacing: '-0.015em' }} charsCount={13} showCopy />
      <Divider sx={{ bgcolor: 'secondary.main', height: '2px', mx: '40px' }} />
    </Grid>
  );
}