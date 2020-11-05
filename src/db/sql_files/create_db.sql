-- File: create_db
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.3
-- -----------------------

-- Database
DROP DATABASE IF EXISTS `codewe`;
CREATE DATABASE `codewe`;
USE `codewe`;

SET NAMES utf8;
SET character_set_client = utf8mb4;

-- Tables
CREATE TABLE `documents` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `document_id` CHAR(5) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT NOW(),
  `last_viewed_date` DATETIME NOT NULL DEFAULT NOW(),
  `content` LONGTEXT,
  PRIMARY KEY (`id`, `document_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Stored procedures
DROP PROCEDURE IF EXISTS `get_document`;

DELIMITER $$
CREATE PROCEDURE get_document(param_document_id CHAR(5))
BEGIN
  SELECT *
    FROM documents d
    WHERE d.document_id = param_document_id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `update_document`;

DELIMITER $$
CREATE PROCEDURE update_document(
  param_document_id CHAR(5),
  param_content LONGTEXT
)
BEGIN
  UPDATE documents d
    SET content = param_content, last_viewed_date = NOW()
    WHERE d.document_id = param_document_id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `create_document`;

DELIMITER $$
CREATE PROCEDURE create_document(
  param_document_id CHAR(5),
  param_content LONGTEXT
)
BEGIN
  INSERT INTO documents(document_id, content)
    VALUES (param_document_id, param_content);
END$$
DELIMITER ;
