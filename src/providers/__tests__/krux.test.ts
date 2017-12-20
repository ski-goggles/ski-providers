import { expect } from 'chai';
import 'mocha';
import { Krux } from '../krux';
import { path } from 'ramda';
import { WebRequestData } from '../../types/Types';

describe('Krux', () => {
    describe('transformer', () => {
        describe('Title', () => {
            describe('When the data contains \'fired\' param', () => {
                const webRequestData: WebRequestData = {
                    meta: {},
                    params: [
                        { label: 'fired', value: 'test', valueType: 'string' }
                    ]
                };
                const transformed = Krux.transformer(webRequestData);
                it('returns the correct event title', () => {
                    expect(path(['meta', 'title'], transformed)).to.eql('test');
                });
            });

            describe('When the data does not contain \'fired\' param', () => {
                const webRequestData: WebRequestData = {
                    meta: {},
                    params: [
                        { label: 'events', value: 'event1', valueType: 'string' }
                    ]
                };
                const transformed = Krux.transformer(webRequestData);
                it('returns the correct event title', () => {
                    expect(path(['meta', 'title'], transformed)).to.eql('Page View');
                });
            });
        });

        describe('Data Layer', () => {
            describe('When a \'_k\' property is present', () => {
                const webRequestData: WebRequestData = {
                    meta: {},
                    params: [
                        { label: '_k1', value: 'test', valueType: 'string' },
                        { label: 'stuff', value: 'test2', valueType: 'string' }
                    ]
                };
                const transformed = Krux.transformer(webRequestData);
                it('sets the correct category', () => {
                    expect(path(['params', 0, 'category'], transformed)).to.eql('Data Layer');
                    expect(path(['params', 1, 'category'], transformed)).to.eql(null);
                });
            });


            describe('When a \'_kpl\' property is present', () => {
                const webRequestData: WebRequestData = {
                    meta: {},
                    params: [
                        { label: '_kpl1', value: 'test', valueType: 'string' },
                        { label: 'stuff', value: 'test2', valueType: 'string' }
                    ]
                };
                const transformed = Krux.transformer(webRequestData);
                it('sets the correct category', () => {
                    expect(path(['params', 0, 'category'], transformed)).to.eql('Data Layer');
                    expect(path(['params', 1, 'category'], transformed)).to.eql(null);
                });
            });

            describe('When a label is present that needs replacing', () => {
                const webRequestData: WebRequestData = {
                    meta: {},
                    params: [
                        { label: 'source', value: 'test', valueType: 'string' },
                    ]
                };
                const transformed = Krux.transformer(webRequestData);
                it('sets the correct label', () => {
                    expect(path(['params', 0, 'label'], transformed)).to.eql('Source');
                });
            });
        });
    });
});
