import { Provider, WebRequestParam, WebRequestData, LabelDictionary } from '../types/Types';
import { map, assoc, prop, sortBy } from 'ramda';
import { labelReplacerFromDictionary, setTitle } from '../PrivateHelpers';
import when from "when-switch";

const transformer = (data: WebRequestData): WebRequestData => {
  const params = sortBy(prop("label"), map(transform, data.params));
  const dataWithTitle = setTitle("Ad Load Request", data);
  return assoc("params", params, dataWithTitle);
};

export const Rubicon: Provider = {
  canonicalName: "Rubicon",
  displayName: "Rubicon",
  logo: "rubicon.png",
  pattern: /fastlane\.rubiconproject\.com/,
  transformer,
};

const transform = (datum: WebRequestParam): WebRequestParam => {
    let category = categorize(datum.label);
    let label : string = labelReplacer(datum.label);
    return { label: label, value: datum.value, valueType: 'string', category };
};

const DATA_LABEL = 'Data Layer';

const categorize = (label: string): string | null => {
  return when(label)
    .match(/^(tg_)(.*)/, DATA_LABEL)
    .else(null);
};

const labelReplacer = (label: string): string => {
    return labelReplacerFromDictionary(label, LabelDictionary);
};

const LabelDictionary : LabelDictionary = {
    source: 'Source'
};
