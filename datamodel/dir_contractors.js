var dir_contractors = [
  {
    "changeID": "dir_contractors__1",
    "changeDatetime": "2016-08-30T08:41:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "CREATE TABLE dir_contractors(ID BIGINT UNSIGNED PRIMARY KEY NOT NULL) CHARACTER SET utf8"
  },
  {
    "changeID": "dir_contractors__2",
    "changeDatetime": "2016-08-30T08:42:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN NAME VARCHAR(200) NOT NULL"
  },
  {
    "changeID": "dir_contractors__3",
    "changeDatetime": "2016-08-30T08:43:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD CONSTRAINT DIR_CONTRACTORS_NAME_UNIQUE UNIQUE(NAME)"
  },

  {
    "changeID": "dir_contractors__4",
    "changeDatetime": "2016-08-30T08:44:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN FULL_NAME VARCHAR(500) NOT NULL"
  },

  {
    "changeID": "dir_contractors__5",
    "changeDatetime": "2016-08-30T08:45:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN NOTE VARCHAR(500)"
  },

  {
    "changeID": "dir_contractors__6",
    "changeDatetime": "2016-08-30T08:46:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN CITY VARCHAR(100)"
  },
  {
    "changeID": "dir_contractors__7",
    "changeDatetime": "2016-08-30T08:47:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN ADDRESS VARCHAR(255)"
  },
  {
    "changeID": "dir_contractors__8",
    "changeDatetime": "2016-08-30T08:48:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN IS_SUPPLIER SMALLINT NOT NULL"
  },
  {
    "changeID": "dir_contractors__9",
    "changeDatetime": "2016-08-30T08:49:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN IS_BUYER SMALLINT NOT NULL"
  },
  {
    "changeID": "dir_contractors_10",
    "changeDatetime": "2016-09-12T00:05:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN COUNTRY VARCHAR(100) NOT NULL"
  },
  {
    "changeID": "dir_contractors_11",
    "changeDatetime": "2016-09-12T00:06:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "INSERT INTO dir_contractors (ID,NAME,FULL_NAME,NOTE,COUNTRY,CITY,ADDRESS,IS_SUPPLIER,IS_BUYER) values (0,'розничный покупатель','розничный покупатель','покупатель','украина','украина','украина',0,1)"
  },
  {
    "changeID": "dir_contractors_12",
    "changeDatetime": "2016-09-12T00:07:00.000",
    "changeObj": "dir_contractors",
    "changeVal": "INSERT INTO dir_contractors (ID,NAME,FULL_NAME,NOTE,COUNTRY,CITY,ADDRESS,IS_SUPPLIER,IS_BUYER) values (1,'поставщик 1','поставщик 1','','украина','украина','украина',1,0)"
  }
];