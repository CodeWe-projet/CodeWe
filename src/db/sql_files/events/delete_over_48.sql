-- File: delete_over_48
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.0
-- -----------------------

USE `codewe`;

DROP EVENT IF EXISTS `dayly_delete_stale_documents`;

DELIMITER $$
CREATE EVENT `dayly_delete_stale_documents`
ON SCHEDULE
  EVERY 1 DAY

DO BEGIN
  DELETE FROM documents
  WHERE last_viewed_date < NOW() - INTERVAL 2 DAY;
END $$

DELIMITER ;
