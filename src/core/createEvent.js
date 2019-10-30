/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { clone, isEmptyObject, createMerger } from "../utils";

export default () => {
  const content = {};
  let userXdm;
  let userData;
  let expectsResponse = false;
  let documentUnloading = false;

  const event = {
    setUserXdm(value) {
      userXdm = value;
    },
    setUserData(value) {
      userData = value;
    },
    mergeXdm: createMerger(content, "xdm"),
    mergeMeta: createMerger(content, "meta"),
    mergeQuery: createMerger(content, "query"),
    documentUnloading() {
      documentUnloading = true;
    },
    isDocumentUnloading() {
      return documentUnloading;
    },
    expectResponse() {
      expectsResponse = true;
    },
    get expectsResponse() {
      return expectsResponse;
    },
    isEmpty() {
      return isEmptyObject(event.toJSON());
    },
    toJSON() {
      const contentClone = clone(content);
      // User-provided XDM should always get merged last so that
      // users can override XDM generated by Alloy.
      if (userXdm) {
        createMerger(contentClone, "xdm")(userXdm);
      }
      if (userData) {
        contentClone.data = userData;
      }
      return contentClone;
    }
  };

  return event;
};
