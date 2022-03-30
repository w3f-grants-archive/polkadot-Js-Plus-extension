// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

/**
 * @description
 *  this component render an individual crowdloan's information
 * */

import { Email, LaunchRounded, SendTimeExtensionOutlined, Twitter } from '@mui/icons-material';
import { Avatar, Button, Divider, Grid, Link, Paper } from '@mui/material';
import React from 'react';

import { LinkOption } from '@polkadot/apps-config/endpoints/types';

import useTranslation from '../../../../extension-ui/src/hooks/useTranslation';
import getLogo from '../../util/getLogo';
import { Crowdloan } from '../../util/plusTypes';
import { amountToHuman, getWebsiteFavico } from '../../util/plusUtils';
import { grey } from '@mui/material/colors';

interface Props {
  coin: string;
  crowdloan: Crowdloan;
  decimals: number;
  endpoints: LinkOption[];
  isActive?: boolean;
  handleContribute?: (arg0: Crowdloan) => void
}

export default function Fund({ coin, crowdloan, decimals, endpoints, handleContribute, isActive }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const getText = (paraId: string): string | undefined => (endpoints.find((e) => e?.paraId === Number(paraId))?.text as string);
  const getHomePage = (paraId: string): string | undefined => (endpoints.find((e) => e?.paraId === Number(paraId))?.homepage as string);
  const getInfo = (paraId: string): string | undefined => (endpoints.find((e) => e?.paraId === Number(paraId))?.info as string);
  const display = crowdloan.identity.info.legal || crowdloan.identity.info.display || getText(crowdloan.fund.paraId);
  const logo = getLogo(getInfo(crowdloan.fund.paraId)) || getWebsiteFavico(crowdloan.identity.info.web || getHomePage(crowdloan.fund.paraId));

  /** FIXME:  new parachains who does not have onchain identity or information in polkadot/apps-config module won't be listed! */
  /** reason: apps-Config needs to be updated regularly buy its developer */
  if (!display) return (<></>);

  return (
    <Grid item sx={{ pb: '10px' }} xs={12}>
      <Paper elevation={3}>
        <Grid alignItems='center' container sx={{ padding: '10px' }}>
          <Grid container item justifyContent='flex-start' sx={{ fontSize: 13, fontWeight: 'fontWeightBold' }} xs={6}>
            <Grid item xs={2}>
              <Avatar
                src={logo}
                sx={{ height: 24, width: 24 }}
              />
            </Grid>

            <Grid container item xs={9}>
              <Grid container item xs={12} spacing={1}>
                <Grid item>
                  {display?.slice(0, 15)}
                </Grid>
                {(crowdloan.identity.info.web || getHomePage(crowdloan.fund.paraId)) &&
                  <Grid item>
                    <Link
                      href={crowdloan.identity.info.web || getHomePage(crowdloan.fund.paraId)}
                      rel='noreferrer'
                      target='_blank'
                    >
                      <LaunchRounded
                        color='primary'
                        sx={{ fontSize: 15 }}
                      />
                    </Link>
                  </Grid>
                }
                {crowdloan.identity.info.twitter &&
                  <Grid item>
                    <Link href={`https://twitter.com/${crowdloan.identity.info.twitter}`}>
                      <Twitter
                        color='primary'
                        sx={{ fontSize: 15 }}
                      />
                    </Link>
                  </Grid>
                }
                {crowdloan.identity.info.email &&
                  <Grid item>
                    <Link href={`mailto:${crowdloan.identity.info.email}`}>
                      <Email
                        color='secondary'
                        sx={{ fontSize: 15 }}
                      />
                    </Link>
                  </Grid>}
              </Grid>
              <Grid item sx={{ color: crowdloan.fund.hasLeased ? 'green' : '', fontSize: 11 }}>
                Parachain Id: {' '} {crowdloan.fund.paraId}
              </Grid>
            </Grid>
            <Divider flexItem orientation='vertical' variant='fullWidth' />
          </Grid>

          <Grid sx={{ fontSize: 11, textAlign: 'left' }} xs={2}>
            {t('Leases')}<br />
            {t('End')}<br />
            {t('Raised/Cap')}
          </Grid>
          <Grid sx={{ fontSize: 11, textAlign: 'right' }} xs={3}>
            {String(crowdloan.fund.firstPeriod)} - {String(crowdloan.fund.lastPeriod)}<br />
            {crowdloan.fund.end}<br />
            <b>{Number(amountToHuman(crowdloan.fund.raised, decimals, 0)).toLocaleString()}</b>/{Number(amountToHuman(crowdloan.fund.cap, decimals)).toLocaleString()}{' '}<br />
          </Grid>

          <Grid sx={{ color: grey[600], fontSize: 11, textAlign: 'left', pl: '5px' }} xs={1}>
            {t('slots')}<br />
            {t('blocks')}<br />
            {coin}s<br />
          </Grid>

          {isActive && handleContribute &&
            <Grid item sx={{ textAlign: 'center' }} xs={12}>
              <Button
                color='warning'
                endIcon={<SendTimeExtensionOutlined />}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => handleContribute(crowdloan)}
                variant='outlined'
              >
                {t('Next')}
              </Button>
            </Grid>
          }
        </Grid>
      </Paper >
    </Grid >
  );
}