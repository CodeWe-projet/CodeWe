-- File: documents
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.0
-- -----------------------

DROP TABLE IF EXISTS `documents`;

CREATE TABLE `documents` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `document_id` CHAR(5) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT NOW(),
  `last_viewed_date` DATETIME NOT NULL DEFAULT NOW(),
  `content` LONGTEXT,
  PRIMARY KEY (`id`, `document_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
