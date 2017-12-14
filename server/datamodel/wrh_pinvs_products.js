module.exports.id=module.id;
var changeLog = [
    { changeID:"wrh_pinvs_products__1", changeDatetime:"2016-09-08 11:31:00", changeObj:"wrh_pinvs_products",
        changeVal:"CREATE TABLE wrh_pinvs_products(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        tableName:"wrh_pinvs_products", field:"ID" },
    { changeID:"wrh_pinvs_products__2", changeDatetime:"2016-09-08 11:32:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD COLUMN PINV_ID BIGINT UNSIGNED NOT NULL",
        field:"PINV_ID"},
    { changeID:"wrh_pinvs_products__3", changeDatetime:"2016-09-08 11:33:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD CONSTRAINT WRH_PINVS_PRODUCTS_PINV_ID_FK " +
            "FOREIGN KEY (PINV_ID) REFERENCES wrh_pinvs(ID)",
        field:"PINV_ID", "source":"wrh_pinvs", "linkField":"ID" },
    { changeID:"wrh_pinvs_products__4", changeDatetime:"2016-09-08 11:34:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD COLUMN POSIND DOUBLE UNSIGNED NOT NULL",
        field:"POSIND"},
    { changeID:"wrh_pinvs_products__5", changeDatetime:"2016-09-08 11:35:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD CONSTRAINT WRH_PINVS_PRODUCTS_ID_FK " +
        "FOREIGN KEY (ID) REFERENCES wrh_products_r_operations(OPERATION_ID)" },
    { changeID:"wrh_pinvs_products__6", changeDatetime:"2016-09-08 11:36:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD COLUMN QTY DECIMAL(12,3) NOT NULL",
        field:"QTY"},
    { changeID:"wrh_pinvs_products__7", changeDatetime:"2016-09-08 11:37:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD COLUMN PRICE DECIMAL(12,4) NOT NULL",
        field:"PRICE"},
    { changeID:"wrh_pinvs_products__8", changeDatetime:"2016-09-08 11:38:00", changeObj:"wrh_pinvs_products",
        changeVal:"ALTER TABLE wrh_pinvs_products ADD COLUMN FACTOR DECIMAL(10,2) NOT NULL",
        field:"FACTOR"}
    //{ changeID:"wrh_pinvs_products_11", changeDatetime:"2016-09-08 11:41:00", changeObj:"wrh_pinvs_products",
    //    changeVal:"ALTER TABLE wrh_pinvs_products ADD CONSTRAINT WRH_PINVS_PINV_ID_POSIND_UNIQUE " +
    //        "UNIQUE(PINV_ID,POSIND)" }
];
module.exports.changeLog=changeLog;
