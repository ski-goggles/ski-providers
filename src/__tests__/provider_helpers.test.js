import { expect } from 'chai';
import { describe, it } from 'mocha';
import { lookup } from '../provider_helpers';
import { Snowplow } from '../providers/snowplow';

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
    });
});
