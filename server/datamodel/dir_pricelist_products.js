var changeLog = [
{ 'changeID':'dir_pricelist_products__1', 'changeDatetime':'2016-12-13 17:36:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'CREATE TABLE dir_pricelist_products_history(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"dir_pricelist_products_history", "field":"ID"},
{ 'changeID':'dir_pricelist_products__2', 'changeDatetime':'2016-12-13 17:37:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN PRICELIST_ID BIGINT UNSIGNED NOT NULL',
    "field":"PRICELIST_ID"},
{ 'changeID':'dir_pricelist_products__3', 'changeDatetime':'2016-12-13 17:37:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD CONSTRAINT DIR_PRICELIST_PRODUCTS_PRICELIST_ID_FK FOREIGN KEY (PRICELIST_ID) REFERENCES dir_pricelists(ID)' },
{ 'changeID':'dir_pricelist_products__4', 'changeDatetime':'2016-12-13 17:39:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN PRODUCT_ID BIGINT UNSIGNED NOT NULL',
    "field":"PRODUCT_ID"},
{ 'changeID':'dir_pricelist_products__5', 'changeDatetime':'2016-12-13 17:40:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD CONSTRAINT DIR_PRICELIST_PRODUCTS_PRODUCT_ID_FK FOREIGN KEY (PRODUCT_ID) REFERENCES dir_products(ID)' },
{ 'changeID':'dir_pricelist_products__6', 'changeDatetime':'2016-12-26 10:16:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN CHANGE_DATETIME DATETIME NOT NULL',
    "field":"CHANGE_DATETIME"},
{ 'changeID':'dir_pricelist_products__7', 'changeDatetime':'2016-12-26 10:17:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ALTER COLUMN CHANGE_DATETIME  DROP DEFAULT'},
{ 'changeID':'dir_pricelist_products__8', 'changeDatetime':'2016-12-26 10:18:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD CONSTRAINT DIR_PL_PRODUCTS_HISTORY_PL_ID_PROD_ID_CHANGE_DATETIME_UNIQUE UNIQUE(PRICELIST_ID,PRODUCT_ID,CHANGE_DATETIME)' },
{ 'changeID':'dir_pricelist_products__9', 'changeDatetime':'2016-12-26 10:19:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN PRICE DECIMAL(12,2)',
    "field":"PRICE"},
{ 'changeID':'dir_pricelist_products_10', 'changeDatetime':'2016-12-29 14:31:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN DISCOUNT DECIMAL(12,2)',
    "field":"DISCOUNT"},
{ 'changeID':'dir_pricelist_products_11', 'changeDatetime':'2016-12-29 14:32:00',
    'changeObj':'model.dir_pricelist_products', 'changeVal':'ALTER TABLE dir_pricelist_products_history ADD COLUMN PRICE_WITH_DISCOUNT DECIMAL(12,2)',
    "field":"PRICE_WITH_DISCOUNT"},
{ 'changeID':'dir_pricelist_products_12', 'changeDatetime':'2017-06-15 16:10:00', 'changeObj':'model.dir_pricelist_products', 'changeVal':'CREATE VIEW dir_pricelist_products(ID, PRICELIST_ID, PRODUCT_ID, PRICE, DISCOUNT, PRICE_WITH_DISCOUNT, MAXCHANGE_DATETIME, DISCOUNT_PECENT) '+
+'AS' +
+'SELECT dpp1.ID, dpp.PRICELIST_ID, dpp.PRODUCT_ID, dpp1.PRICE, dpp1.DISCOUNT, dpp1.PRICE_WITH_DISCOUNT, dpp1.CHANGE_DATETIME as MAXCHANGE_DATETIME,' +
+'dpp1.DISCOUNT*100 as DISCOUNT_PECENT' +
+'FROM dir_pricelist_products_history dpp' +
+'LEFT JOIN dir_pricelist_products_history dpp1 ON dpp1.PRICELIST_ID=dpp.PRICELIST_ID AND dpp1.PRODUCT_ID=dpp.PRODUCT_ID' +
+'GROUP BY dpp.PRICELIST_ID, dpp.PRODUCT_ID, dpp1.ID, dpp1.PRICE, dpp1.DISCOUNT, dpp1.PRICE_WITH_DISCOUNT, dpp1.CHANGE_DATETIME' +
+'HAVING dpp1.CHANGE_DATETIME=MAX(dpp.CHANGE_DATETIME)' }
];
module.exports.changeLog=changeLog;