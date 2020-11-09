-- File: update_document
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.1
-- -----------------------

USE codewe;

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
