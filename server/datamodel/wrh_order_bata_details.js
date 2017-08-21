var changeLog=[
    { "changeID": "wrh_order_bata_details__1", "changeDatetime": "2016-09-04T20:01:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "CREATE TABLE wrh_order_bata_details(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        "tableName":"wrh_order_bata_details", "field":["ID"], "id":"ID" },
    { "changeID": "wrh_order_bata_details__2", "changeDatetime": "2016-09-04T20:02:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN ORDER_BATA_ID BIGINT UNSIGNED NOT NULL",
        "field":["ORDER_BATA_ID"] },
    { "changeID": "wrh_order_bata_details__3", "changeDatetime": "2016-09-04T20:03:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD CONSTRAINT WRH_ORDER_BATA_DETAILS_ORDER_BATA_ID_FK"
        +" FOREIGN KEY (ORDER_BATA_ID) REFERENCES wrh_orders_bata(ID)" },
    { "changeID": "wrh_order_bata_details__4", "changeDatetime": "2016-09-04T20:04:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN POS INTEGER UNSIGNED NOT NULL NOT NULL",
        "field":["POS"] },
    { "changeID": "wrh_order_bata_details__5", "changeDatetime": "2016-09-04T20:05:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN PRODUCT_GENDER_ID BIGINT UNSIGNED NOT NULL",
        "field":["PRODUCT_GENDER_ID"] },
    { "changeID": "wrh_order_bata_details__6", "changeDatetime": "2016-09-04T20:06:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD CONSTRAINT WRH_ORDER_BATA_DETAILS_PRODUCT_GENDER_ID_FK"
        +" FOREIGN KEY (PRODUCT_GENDER_ID) REFERENCES dir_products_genders(ID)" },
    { "changeID": "wrh_order_bata_details__7", "changeDatetime": "2016-09-04T20:07:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN PRODUCT_CATEGORY_ID BIGINT UNSIGNED NOT NULL",
        "field":["PRODUCT_CATEGORY_ID"] },
    { "changeID": "wrh_order_bata_details__8", "changeDatetime": "2016-09-04T20:08:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD CONSTRAINT WRH_ORDER_BATA_DETAILS_PRODUCT_CATEGORY_ID_FK"
        +" FOREIGN KEY (PRODUCT_CATEGORY_ID) REFERENCES dir_products_categories(ID)" },
    { "changeID": "wrh_order_bata_details__9", "changeDatetime": "2016-09-04T20:09:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN PRODUCT_ARTICLE_ID BIGINT UNSIGNED NOT NULL",
        "field":["PRODUCT_ARTICLE_ID"] },
    { "changeID": "wrh_order_bata_details_10", "changeDatetime": "2016-09-04T20:10:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD CONSTRAINT WRH_ORDER_BATA_DETAILS_PRODUCT_ARTICLE_ID_FK"
        +" FOREIGN KEY (PRODUCT_ARTICLE_ID) REFERENCES dir_products_articles(ID)" },
    { "changeID": "wrh_order_bata_details_11", "changeDatetime": "2016-09-04T20:11:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN QTY DECIMAL(12,3) NOT NULL",
        "field":["QTY"] },
    { "changeID": "wrh_order_bata_details_12", "changeDatetime": "2016-09-04T20:22:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN RETAIL_PRICE DECIMAL(12,4) NOT NULL",
        "field":["RETAIL_PRICE"] },
    { "changeID": "wrh_order_bata_details_13", "changeDatetime": "2016-09-04T20:23:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN PRICE DECIMAL(12,4) NOT NULL",
        "field":["PRICE"] },
    { "changeID": "wrh_order_bata_details_14", "changeDatetime": "2016-09-04T20:24:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN POSSUM DECIMAL(12,2) NOT NULL",
        "field":["POSSUM"] },
    { "changeID": "wrh_order_bata_details_15", "changeDatetime": "2016-09-11T16:31:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD COLUMN PRODUCT_SUBCATEGORY_ID BIGINT UNSIGNED NOT NULL",
        "field":["PRODUCT_SUBCATEGORY_ID"] },
    { "changeID": "wrh_order_bata_details_16", "changeDatetime": "2016-09-11T16:32:00.000+0300", "changeObj": "wrh_order_bata_details",
        "changeVal": "ALTER TABLE wrh_order_bata_details ADD CONSTRAINT WRH_ORDER_BATA_DETAILS_PRODUCT_SUBCATEGORY_ID_FK"
        +" FOREIGN KEY (PRODUCT_SUBCATEGORY_ID) REFERENCES dir_products_subcategories(ID)" }
];
module.exports.changeLog=changeLog;

