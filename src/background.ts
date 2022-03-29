import browser = require('webextension-polyfill');

browser.runtime.onInstalled.addListener(onInstalled)
browser.runtime.onStartup.addListener(onStartup);

function onInstalled() {
    console.log("Hello Devoxx & App Installed !");
}

function onStartup() {
    console.log("Hello Devoxx & App Started !");
}