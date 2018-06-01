import { FormattedWebRequestData, LabelDictionary, FormattedDataItem, BasicKeyValueObject } from "./types/Types";
import { propOr, lensPath, set, defaultTo } from "ramda";

export const labelReplacerFromDictionary = (label: string, dictionary: BasicKeyValueObject): string => {
  return propOr(label, label, dictionary);
};

export const setTitle = (t: string | null, data: FormattedDataItem[]): FormattedWebRequestData => {
  const title = defaultTo("No Title", t) as string;
  return {
    meta: {
      title,
    },
    data,
  };
};
