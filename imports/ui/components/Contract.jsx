import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Validators } from '/imports/api/validators/validators.js';

const AddressLength = 40;

export default class Account extends Component{
    constructor(props){
        super(props);

        this.state = {
            link: `/account/${this.props.address}`,
            address: this.props.address,
            label: this.props.label || "CosmWasm Contract"
        }
    }

    getFields() {
        return {address:1, description:1, operator_address:1, delegator_address:1, profile_url:1};
    }

    getAccount = () => {
        let address = this.props.address;
        let validator = Validators.findOne(
            {$or: [{operator_address:address}, {delegator_address:address}, {address:address}]},
            {fields: this.getFields() });
        if (validator)
            this.setState({
                address: `/validator/${validator.address}`,
                moniker: validator.description?validator.description.moniker:validator.operator_address,
                validator: validator
            });
        else
            this.setState({
                address: `/validator/${address}`,
                moniker: address,
                validator: null
            });
    }


    updateAccount = () => {
        this.setState({
            link: `/contracts/${this.props.address}`,
            address: this.props.address,
            label: this.props.label || "CosmWasm Contract"
        });
    }

    getAccount = () => {
        this.setState({
            link: `/contracts/${this.props.address}`,
            address: this.props.address,
            label: this.props.label || "CosmWasm Contract"
        });

    }

    componentDidMount(){
        if (this.props.sync)
            this.getAccount();
        else
            this.updateAccount();
    }

    componentDidUpdate(prevProps){
        if (this.props.address != prevProps.address){
            if (this.props.sync) {
                this.getAccount();
            }
            else {
                this.setState({
                    link: `/contracts/${this.props.address}`,
                    address: this.props.address,
                    label: this.props.label || "CosmWasm Contract"
                });
                this.updateAccount();
            }
        }
    }

    render(){
        return <span className={(this.props.copy)?"address overflow-auto d-inline-block copy":"address overflow-auto d-inline"} >
            <Link to={this.state.link}>{this.state.address}</Link>
        </span>
    }
}
