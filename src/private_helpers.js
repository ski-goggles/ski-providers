// @flow

import type { WebRequestData } from './types';
// $FlowFixMe
import { propOr, lensPath, set } from 'ramda';

export const labelReplacerFromDictionary = (label: string, dictionary: {[string]: string}): string => {
    return propOr(label, label, dictionary);
};

export const setTitle = (title: ?string, data: WebRequestData): WebRequestData => {
    const lens = lensPath(['meta', 'title']);
    if(title){
        return set(lens, title, data);
    } else {
        return data;
    }
};
