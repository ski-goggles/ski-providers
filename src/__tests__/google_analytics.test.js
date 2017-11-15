import { expect } from 'chai';
import { describe, it } from 'mocha';
import { GoogleAnalytics } from '../providers/google_analytics';
import { path } from 'ramda';

describe('Google Analytics', () => {
    describe('transformer', () => {
        describe('Title', () => {
            describe('When the data contains \'ea\' param', () => {
                const webRequestData = {
                    meta: {},
                    params: [
                        { label: 'ea', value: 'play', valueType: 'string' }
                    ]
                };
                const transformed = GoogleAnalytics.transformer(webRequestData);
                it('returns the label as Title', () => {
                    expect(path(['meta', 'title'], transformed)).to.eql('play');
                });
            });

            describe('When the data does not contain \'ea\' param', () => {
                const webRequestData = {
                    meta: {},
                    params: [
                        { label: 'pet', value: 'stuff', valueType: 'string' }
                    ]
                };
                const transformed = GoogleAnalytics.transformer(webRequestData);
                it('returns the Page Load label', () => {
                    expect(path(['meta', 'title'], transformed)).to.eql('Page Load');
                });
            });
        });
    });
});
