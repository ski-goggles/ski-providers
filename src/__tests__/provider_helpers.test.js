import { expect } from 'chai';
import { describe, it } from 'mocha';
import { lookup, lookupByUrl, generateMasterPattern, matchesBroadly } from '../provider_helpers';
import { Snowplow } from '../providers/snowplow';
import { map, propOr, path } from 'ramda';
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

    describe('generateMasterPattern', () => {
        describe('with a selected list of Providers', () => {
            it('returns a master Regex pattern', () => {
                const pattern = generateMasterPattern(['Snowplow', 'Krux']);
                expect(pattern).to.eql(/(\/i\?.*tv=js-\d)|beacon\.krxd\.net\/pixel\.gif/);
            });
        });
    });

    describe('matchesBroadly', () => {
        const masterPattern = generateMasterPattern('Snowplow', 'Krux', 'Rubicon');

        describe('with a correct match', () => {
            const snowplowCall = path([0, 'url'] , matchedUrls);
            it('returns true', () => {
                expect(matchesBroadly(snowplowCall, masterPattern)).to.eql(true);
            });
        });

        describe('with an incorrect match', () => {
            it('returns false', () => {
                expect(matchesBroadly('http://google.com', masterPattern)).to.eql(false);
            });
        });
    });
});