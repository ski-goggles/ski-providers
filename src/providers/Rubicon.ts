import { map, prop, sortBy } from "ramda";
import when from "when-switch";
import { createFormattedDataFromObject, labelReplacerFromDictionary, setTitle } from "../PrivateHelpers";
import { FormattedDataItem, FormattedWebRequestData, LabelDictionary, Provider, RawWebRequestData } from "../types/Types";

const transformer = (rwrd: RawWebRequestData): FormattedWebRequestData => {
  const formatted: FormattedDataItem[] = parse(rwrd);
  const data: FormattedDataItem[] = sortBy(prop("label"), map(transform, formatted));
  return setTitle("Ad Load Request", data);
};

export const Rubicon: Provider = {
  canonicalName: "Rubicon",
  displayName: "Rubicon",
  logo: "rubicon.png",
  pattern: /fastlane\.rubiconproject\.com/,
  transformer,
};

const parse = (rwrd: RawWebRequestData): FormattedDataItem[] => {
  switch (rwrd.requestType) {
    case "GET":
      return createFormattedDataFromObject(rwrd.requestParams);
    case "POST":
      console.log(`POST support for ${Rubicon.canonicalName} is not implemented.`);
      return [];
    default:
      return [];
  }
};

const transform = (datum: FormattedDataItem): FormattedDataItem => {
  let category = categorize(datum.label);
  let label: string = labelReplacer(datum.label);
  return { label: label, value: datum.value, formatting: "string", category };
};

const DATA_LABEL = "Data Layer";

const categorize = (label: string): string | null => {
  return when(label)
    .match(/^(tg_)(.*)/, DATA_LABEL)
    .else(null);
};

const labelReplacer = (label: string): string => {
  return labelReplacerFromDictionary(label, LabelDictionary);
};

const LabelDictionary: LabelDictionary = {
  source: "Source",
};
