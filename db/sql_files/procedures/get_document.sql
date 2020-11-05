-- File: get_document
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.0
-- -----------------------

DROP PROCEDURE IF EXISTS `get_document`;

DELIMITER $$
CREATE PROCEDURE get_document(param_document_id CHAR(5))
BEGIN
  SELECT *
    FROM documents d
    WHERE d.document_id = param_document_id;
END$$
DELIMITER ;
