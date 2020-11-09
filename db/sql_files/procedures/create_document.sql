-- File: create_document
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.1
-- -----------------------

USE codewe;

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
