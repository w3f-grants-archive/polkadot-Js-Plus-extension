// Copyright 2019-2022 @polkadot/extension-plus authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
/* eslint-disable react/jsx-max-props-per-line */

import type { DeriveProposal } from '@polkadot/api-derive/types';

import { Avatar, Button, Divider, Grid, Link, Paper } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { Chain } from '../../../../../../extension-chains/src/types';
import useTranslation from '../../../../../../extension-ui/src/hooks/useTranslation';
import Hint from '../../../../components/Hint';
import getLogo from '../../../../util/getLogo';
import { ChainInfo, ProposalsInfo } from '../../../../util/plusTypes';
import { amountToHuman, formatMeta } from '../../../../util/plusUtils';
import Identity from '../../../../components/Identity';
import Second from './Second';

interface Props {
  proposalsInfo: ProposalsInfo;
  chain: Chain;
  chainInfo: ChainInfo;
}

const secondToolTip = 'Express your backing. Proposals with greater interest moves up the queue for potential next referendums.';

export default function Proposals({ chain, chainInfo, proposalsInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { accountsInfo, proposals } = proposalsInfo;
  const chainName = chain?.name.replace(' Relay Chain', '');

  const [showVoteProposalModal, setShowVoteProposalModal] = useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] = useState<DeriveProposal>();

  const handleSecond = useCallback((p: DeriveProposal): void => {
    setShowVoteProposalModal(true);
    setSelectedProposal(p);
  }, []);

  const handleVoteProposalModalClose = useCallback(() => {
    setShowVoteProposalModal(false);
  }, []);

  return (
    <>
      {proposals?.length
        ? proposals.map((p, index) => {
          const value = p.image?.proposal;
          const meta = value?.registry.findMetaCall(value.callIndex);
          const description = formatMeta(meta?.meta);

          return (
            <Paper elevation={4} key={index} sx={{ borderRadius: '10px', margin: '20px 30px 10px', p: '10px 20px' }}>
              <Grid container justifyContent='space-between'>
                {value
                  ? <Grid item sx={{ fontSize: 11 }} xs={4}>
                    {meta.section}. {meta.method}
                  </Grid>
                  : <Grid item xs={4}></Grid>
                }
                <Grid item sx={{ fontSize: 12, textAlign: 'center' }} xs={4}>
                  #{String(p?.index)} {' '}
                </Grid>

                <Grid container item justifyContent='flex-end' xs={4}>
                  <Grid item>
                    <Link
                      href={`https://${chainName}.polkassembly.io/proposal/${p?.index}`}
                      rel='noreferrer'
                      target='_blank'
                      underline='none'
                    >
                      <Avatar
                        alt={'Polkassembly'}
                        src={getLogo('polkassembly')}
                        sx={{ height: 15, width: 15 }}
                      />
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href={`https://${chainName}.subscan.io/democracy_proposal/${p?.index}`}
                      rel='noreferrer'
                      target='_blank'
                      underline='none'
                    >
                      <Avatar
                        alt={'subscan'}
                        src={getLogo('subscan')}
                        sx={{ height: 15, width: 15 }}
                      />
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Divider />
              </Grid>

              <Grid container justifyContent='space-between' sx={{ fontSize: 11, paddingTop: 1, color: 'red' }}>
                <Grid item>
                  {t('Locked')}{': '}{Number(amountToHuman(p.balance.toString(), chainInfo.decimals)).toLocaleString()} {' '}{chainInfo.coin}
                </Grid>
                <Grid item>
                  {t('Deposit')}{': '}{amountToHuman(p.image.balance.toString(), chainInfo.decimals, 6)} {' '}{chainInfo.coin}
                </Grid>
                <Grid item>
                  {t('Seconds')}{': '}{p.seconds.length - 1}
                </Grid>
              </Grid>

              <Grid item sx={{ fontSize: 12, fontWeight: '600', margin: '20px 0px 30px' }} xs={12}>
                {description}
              </Grid>

              {p?.proposer &&
                <Identity accountInfo={accountsInfo[index]} chain={chain} showAddress title={t('Proposer')} />
              }

              {/* <Grid item xs={12} sx={{ border: '1px dotted', borderRadius: '10px', padding: 1, margin: '20px 1px 20px' }}>
                {t('Hash')}<br />
                {p.imageHash.toString()}
              </Grid> */}

              <Grid item sx={{ paddingTop: 2, textAlign: 'center' }} xs={12}>
                <Hint id='seconding' place='top' tip={secondToolTip}>
                  <Button color='warning' onClick={() => handleSecond(p)} variant='contained'>
                    {t('Second')}
                  </Button>
                </Hint>
              </Grid>
            </Paper>);
        })
        : <Grid sx={{ paddingTop: 3, textAlign: 'center' }} xs={12}>
          {t('No active proposals')}
        </Grid>}

      {showVoteProposalModal &&
        <Second
          chain={chain}
          chainInfo={chainInfo}
          handleVoteProposalModalClose={handleVoteProposalModalClose}
          selectedProposal={selectedProposal}
          showVoteProposalModal={showVoteProposalModal}
        />
      }

    </>
  );
}