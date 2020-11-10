-- File: users
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.2
-- -----------------------

-- Human Administator called `ABN` - has ALL permissions
DROP USER IF EXISTS `ABS`;
CREATE USER `ABN` IDENTIFIED BY [**redacted**];
GRANT ALL
ON codewe.*
TO ABN;

-- Python API - has Read/Write permissions.
DROP USER IF EXISTS `codewe_python_api`@`localhost`;
CREATE USER `codewe_python_api`@`localhost` IDENTIFIED BY [**redacted**];
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
ON codewe.*
TO `codewe_python_api`@`localhost`;
