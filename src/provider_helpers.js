// @flow

import type { ProviderCanonicalName, Provider } from './types';
import * as Providers from './providers';
import { values, find, path, isNil } from 'ramda';

export const lookup = (name: ProviderCanonicalName): ?Provider => {
    return find(
        (p) => (p.canonicalName === name),
        values(Providers)
    );
};

export const lookupByUrl = (url: string) : (Provider | null) => {
    let provider = find(
        (p) => !!(url.match(path(['pattern'], p))),
        values(Providers)
    );

    return isNil(provider) ? null : provider;
};