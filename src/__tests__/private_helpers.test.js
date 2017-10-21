import { expect } from 'chai';
import { describe, it } from 'mocha';
import { labelReplacerFromDictionary, setTitle } from '../private_helpers';
import { path } from 'ramda';

describe('Providers', () => {
    describe('Helpers', () => {
        describe('labelReplacerFromDictionary', () => {
            const dictionary = {
                'test': 'Awesome'
            };

            describe('with an existing label', () => {
                it('returns the looked up label', () => {
                    const returned = labelReplacerFromDictionary('test', dictionary);
                    expect(returned).to.eq('Awesome');
                });
            });

            describe('with a non-existent label', () => {
                it('returns the unchanged label', () => {
                    const returned = labelReplacerFromDictionary('what?', dictionary);
                    expect(returned).to.eq('what?');
                });
            });
        });

        describe('setTitle', () => {
            const webRequestData = {
                meta: {},
                params: [
                    { label: 'test', value: 'awesome', valueType: 'string' }
                ]
            };

            it('Sets the title', () => {
                const transformed = setTitle('Awesome Title', webRequestData);
                expect(path(['meta', 'title'], transformed)).to.eq('Awesome Title');
            });
        });
    });
});
