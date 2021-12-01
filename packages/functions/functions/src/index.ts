/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);

exports = Object.assign(
    exports,
    require("./hello"),
    require("./processMedia"),
    require("./register"),
    require("./roles")
);
