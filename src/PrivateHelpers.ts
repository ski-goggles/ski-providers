import { WebRequestData, LabelDictionary } from "./types/Types";
import { propOr, lensPath, set } from "ramda";

export const labelReplacerFromDictionary = (label: string, dictionary: LabelDictionary): string => {
  return propOr(label, label, dictionary);
};

export const setTitle = (title: string | null, data: WebRequestData): WebRequestData => {
  if (title) {
    const lens = lensPath(["meta", "title"]);
    return set(lens, title, data);
  } else {
    return data;
  }
};
