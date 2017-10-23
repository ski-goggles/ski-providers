import { expect } from 'chai';
import { describe, it } from 'mocha';
import { lookup, lookupByUrl } from '../provider_helpers';
import { Snowplow } from '../providers/snowplow';
import { map, propOr } from 'ramda';
import { matchedUrls } from './fixtures';

describe('Providers', () => {
    describe('Helpers', () => {
        describe('lookup', () => {
            describe('when a valid Provider Canonical Name is provided', () => {
                it('returns the correct Provider', () => {
                    const returned = lookup('Snowplow');
                    expect(returned).to.eq(Snowplow);
                });
            });

            describe('when an invalid Provider Canonical Name is provided', () => {
                it('\'undefined\' is returned', () => {
                    const returned = lookup('Farmplow');
                    expect(returned).to.eq(undefined);
                });
            });
        });

        describe('lookupByUrl', () => {
            map(
                (item) => {
                    describe(`with a url of provider: ${item.provider}`, () => {
                        it('matches the right provider', () => {
                            const provider = propOr(null, 'displayName', lookupByUrl(item.url));
                            expect(provider).to.eql(item.provider);
                        });
                    });
                },
                matchedUrls
            );
        });
    });
});