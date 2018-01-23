import { Provider, WebRequestParam, WebRequestData, LabelDictionary } from '../types/Types';
import { find, map, assoc, prop, propOr, defaultTo, sortBy } from 'ramda';
import { labelReplacerFromDictionary, setTitle } from '../PrivateHelpers';
import when from "when-switch";

const transformer = (data: WebRequestData): WebRequestData => {
  const params: WebRequestParam[] = sortBy(prop("label"), map(transform, data.params));
  const dataWithTitle = setTitle(getEventName(params), data);
  return assoc("params", params, dataWithTitle);
};

export const Krux: Provider = {
  canonicalName: "Krux",
  displayName: "Krux",
  logo: "krux.png",
  pattern: /beacon\.krxd\.net\/(pixel|event)\.gif/,
  transformer,
};

const getEventName = (params: WebRequestParam[]): string | null => {
  const row = find(e => e.label == "fired", params);
  const eventName: string | null = propOr(null, "value", row);
  return defaultTo("Page View", eventName);
};

const transform = (datum: WebRequestParam): WebRequestParam => {
    let category = categorize(datum.label);
    let label : string = labelReplacer(datum.label);
    return { label: label, value: datum.value, valueType: 'string', category };
};

const DATA_LABEL = 'Data Layer';

const categorize = (label: string): string | null => {
  return when(label)
    .match(/^(_k|kpl)(.*)/, DATA_LABEL)
    .else(null);
};

const labelReplacer = (label: string): string => {
    return labelReplacerFromDictionary(label, LabelDictionary);
};

const LabelDictionary : LabelDictionary = {
    source: 'Source'
};
