import { expect } from 'chai';
import { describe, it } from 'mocha';
import { SkiProviders, SkiProviderHelpers } from '../index';

describe('Smoke Test', () => {
    describe('SkiProviders', () => {
        it('is exported correctly', () => {
            expect(SkiProviders.Snowplow.canonicalName).to.eql('Snowplow');
        });
    });

    describe('SkiProviderHelpers', () => {
        it('is exported correctly', () => {
            expect(SkiProviderHelpers.lookup('Snowplow').canonicalName).to.eql('Snowplow');
        });
    });
});
