// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  getDebtorAPI: 'http://52.172.13.43:6001/getDebtor',
  getSecuredPartyAPI: 'http://52.172.13.43:6001/getsecuredparties',
  getCollateralAPI: 'http://52.172.13.43:6001/getcollaterol',
  getStatesAPI: 'http://52.172.13.43:6001/getstates',
  getJurisdictionAPI: 'http://52.172.13.43:6001/getjurisdictions',
  postNewFilling: 'http://52.172.13.43:6001/submitdoc',
  postToBlockChain: 'http://52.172.13.43:6003/api/org.example.mynetwork.NewFilling',
  getNewFillingFromBlock: 'http://52.172.13.43:6003/api/org.example.mynetwork.NewFilling/',
  postHashToBlock : 'http://52.172.13.43:6003/api/org.example.mynetwork.StoreHash',
  postTransactionId : 'http://52.172.13.43:6001/postTransactionId',
  getDataFromDB : 'http://52.172.13.43:6001/showFilling',
  getTransactionDetails : 'http://52.172.13.43:6003/api/org.example.mynetwork.StoreHash/',
  postPdf : 'http://52.172.13.43:6001/getpdf',
  getPdf : 'http://52.172.13.43:6001/getpdf'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
