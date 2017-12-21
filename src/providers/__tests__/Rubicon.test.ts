import { expect } from 'chai';
import 'mocha';
import { Rubicon } from '../Rubicon';
import { path } from 'ramda';
import { WebRequestData } from '../../types/Types';

describe("Rubicon", () => {
  describe("transformer", () => {
    describe("Title", () => {
      const webRequestData: WebRequestData = {
        meta: {},
        params: [{ label: "fired", value: "test", valueType: "string" }],
      };
      const transformed = Rubicon.transformer(webRequestData);
      it("returns the correct event title", () => {
        expect(path(["meta", "title"], transformed)).to.eql("Ad Load Request");
      });
    });

    describe("Data Layer", () => {
      describe("When a 'tg_' property is present", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [
            { label: "tg_i", value: "test", valueType: "string" },
            { label: "u", value: "test2", valueType: "string" },
          ],
        };
        const transformed = Rubicon.transformer(webRequestData);
        it("sets the correct category", () => {
          expect(path(["params", 0, "category"], transformed)).to.eql("Data Layer");
          expect(path(["params", 1, "category"], transformed)).to.eql(null);
        });
      });

      describe("When a label is present that needs replacing", () => {
        const webRequestData: WebRequestData = {
          meta: {},
          params: [{ label: "source", value: "test", valueType: "string" }],
        };
        const transformed = Rubicon.transformer(webRequestData);
        it("sets the correct label", () => {
          expect(path(["params", 0, "label"], transformed)).to.eql("Source");
        });
      });
    });
  });
});
