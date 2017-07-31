CREATE TABLE IF NOT EXISTS `shop` (
  `article` int(4) unsigned zerofill NOT NULL DEFAULT '0000',
  `dealer` char(20) NOT NULL DEFAULT '',
  `price` double(16,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`article`,`dealer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0001','A',3.45);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0001','B',3.99);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0002','A',10.99);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0003','B',1.45);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0003','C',1.69);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0003','D',1.25);
INSERT INTO `shop` (`article`,`dealer`,`price`) VALUES ('0004','D',19.95);