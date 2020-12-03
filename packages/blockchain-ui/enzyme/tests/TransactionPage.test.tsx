// tslint:disable no-unused-expression
import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import TransactionPage from '../../src/components/pages/TransactionPage/TransactionPage';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ITransaction from '../../src/interfaces/ITransaction';
import ISmartContract from '../../src/interfaces/ISmartContract';
import IDataFileTransaction from '../../src/interfaces/IDataFileTransaction';
chai.should();
chai.use(sinonChai);

describe('TransactionPage component', () => {
    let mySandBox: sinon.SinonSandbox;
    let postMessageHandlerStub: sinon.SinonStub;

    const transactionOne: ITransaction = {
        name: 'transactionOne',
        parameters: [{
            description: '',
            name: 'name',
            schema: {}
        }],
        returns: {
            type: ''
        },
        tag: ['submit']
    };

    const transactionTwo: ITransaction = {
        name: 'transactionTwo',
        parameters: [],
        returns: {
            type: ''
        },
        tag: ['submit']
    };

    const greenContract: ISmartContract = {
        name: 'greenContract',
        version: '0.0.1',
        channel: 'mychannel',
        label: 'greenContract@0.0.1',
        transactions: [transactionOne, transactionTwo],
        namespace: 'GreenContract',
        peerNames: ['peer1', 'peer2']
    };

    const transactionViewData: {gatewayName: string, smartContract: ISmartContract, associatedTxdata: undefined, txdataTransactions: IDataFileTransaction[], preselectedTransaction: ITransaction } = {
        gatewayName: 'myGateway',
        smartContract: greenContract,
        associatedTxdata: undefined,
        txdataTransactions: [],
        preselectedTransaction: { name: '', parameters: [], returns: { type: '' }, tag: [] },
    };

    const mockTransactionOutput: string = 'here is some transaction output';
    const moreMockTransactionOutput: string = 'here is some more transaction output';

    beforeEach(async () => {
        mySandBox = sinon.createSandbox();
        postMessageHandlerStub = mySandBox.stub();
    });

    afterEach(async () => {
        mySandBox.restore();
    });

    it('should render the expected snapshot', async () => {
        const component: any = renderer
            .create(<TransactionPage transactionViewData={transactionViewData} transactionOutput={mockTransactionOutput}/>)
            .toJSON();
        expect(component).toMatchSnapshot();
    });

    it('should update the smartContract when a new one is passed down through props', async () => {
        const componentDidUpdateSpy: sinon.SinonSpy = mySandBox.spy(TransactionPage.prototype, 'componentDidUpdate');
        const component: any = mount(<TransactionPage transactionViewData={transactionViewData} transactionOutput={mockTransactionOutput}/>);
        expect(component.state()).toHaveProperty('smartContract', greenContract);

        const newContract: ISmartContract =  { ...greenContract, name: 'updatedContract' };
        component.setProps({
            transactionViewData: {
                smartContract: newContract,
            }
        });

        componentDidUpdateSpy.should.have.been.called;
        component.state().smartContract.should.equal(newContract);
    });

    it('should update the associatedTxdata when something new is passed down through props', async () => {
        const componentDidUpdateSpy: sinon.SinonSpy = mySandBox.spy(TransactionPage.prototype, 'componentDidUpdate');
        const component: any = mount(<TransactionPage transactionViewData={transactionViewData} transactionOutput={mockTransactionOutput}/>);
        expect(component.state()).toHaveProperty('associatedTxdata', undefined);

        component.setProps({
            transactionViewData: {
                smartContract: greenContract,
                associatedTxdata: 'new data',
            }
        });

        componentDidUpdateSpy.should.have.been.called;
        component.state().associatedTxdata.should.equal('new data');
    });

    it('should update the transaction output when something new is passed down through props', async () => {
        const componentDidUpdateSpy: sinon.SinonSpy = mySandBox.spy(TransactionPage.prototype, 'componentDidUpdate');
        const component: any = mount(<TransactionPage transactionViewData={transactionViewData} transactionOutput={mockTransactionOutput}/>);
        component.state().transactionOutput.should.equal(mockTransactionOutput);

        component.setProps({
            transactionOutput: moreMockTransactionOutput
        });
        componentDidUpdateSpy.should.have.been.called;
        component.state().transactionOutput.should.equal(moreMockTransactionOutput);
    });
});
