
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Alert, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { TxIcon } from '../components/Icons.jsx';
import Activities from '../components/Activities.jsx';
import CosmosErrors from '../components/CosmosErrors.jsx';
import TimeAgo from '../components/TimeAgo.jsx';
import numbro from 'numbro';
import Coin from '/both/utils/coins.js'
import SentryBoundary from '../components/SentryBoundary.jsx';
import { Markdown } from 'react-showdown';

let showdown  = require('showdown');
showdown.setFlavor('github');

export const TransactionRow = (props) => {
    let tx = props.tx;
     
    return <SentryBoundary><Row className={(tx.code)?"tx-info invalid":"tx-info"}>
        <Col xs={12} lg={8} className="activity">{(tx.tx.value.msg && tx.tx.value.msg.length >0)?tx.tx.value.msg.map((msg,i) => {
            return <Card body key={i}><Activities msg={msg} invalid={(!!tx.code)} events={(tx.logs&&tx.logs[i])?tx.logs[i].events:null} /></Card>
        }):''}</Col>
        <Col xs={(!props.blockList)?{size:6,order:"last"}:{size:12,order:"last"}} md={(!props.blockList)?{size:3, order: "last"}:{size:7, order: "last"}} lg={(!props.blockList)?{size:1,order:"last"}:{size:2,order:"last"}} className="text-truncate"><i className="fas fa-hashtag d-lg-none"></i> <Link to={"/transactions/"+tx.txhash}>{tx.txhash}</Link></Col>
        <Col xs={6} md={9} lg={{size:2,order:"last"}} className="text-nowrap"><i className="material-icons">schedule</i> <span>{tx.block()?<TimeAgo time={tx.block().time} />:''}</span>{(tx.tx.value.memo && tx.tx.value.memo != "")?<span>
            <i className="material-icons ml-2 memo-button" id={"memo-"+tx.txhash}>message</i>
            <UncontrolledPopover trigger="legacy" placement="top-start" target={"memo-"+tx.txhash}>
                <PopoverBody><Markdown markup={tx.tx.value.memo} /></PopoverBody>
            </UncontrolledPopover>
        </span>:""}</Col>
        {(!props.blockList)?<Col xs={4} md={2} lg={1}><i className="fas fa-database d-lg-none"></i> <Link to={"/blocks/"+tx.height}>{numbro(tx.height).format("0,0")}</Link></Col>:''}
        <Col xs={(!props.blockList)?2:4} md={1}>{(!tx.code)?<TxIcon valid />:<TxIcon />}</Col>
        <Col xs={(!props.blockList)?6:8} md={(!props.blockList)?9:4} lg={1} className="fee"><i className="material-icons d-lg-none">monetization_on</i> {(tx.tx.value.fee.amount.length > 0)?tx.tx.value.fee.amount.map((fee,i) => {
            return <span className="text-nowrap" key={i}>{(new Coin(parseFloat(fee.amount), (fee)?fee.denom:null)).stakeString()}</span>
        }):<span>No fee</span>}</Col>
        {(tx.code)?<Col xs={{size:12, order:"last"}} className="error">
            <Alert color="danger">
                <CosmosErrors
                    code={tx.code}
                    codespace={tx.codespace}
                    log={tx.raw_log}
                />
            </Alert>
        </Col>:''}
    </Row></SentryBoundary>
}
