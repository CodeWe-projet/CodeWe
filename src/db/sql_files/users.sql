-- File: users
-- Author: Theo Technicguy
-- Interpreter: SQL Engine
-- Ext: sql
-- Licensed under MIT
-- Copyright (c) 2020 Alexandre Dewilde, Brieuc Dubois and Theo Technicguy.
-- Version 0.1.0
-- -----------------------

-- Human Administator called `ABN` - has ALL permissions
CREATE USER `ABN` IDENTIFIED BY [**redacted**];
GRANT ALL
ON CodeWe.*
TO ABN;

-- Python API - has Read/Write permissions.
CREATE USER `codewe_python_api` IDENTIFIED BY [**redacted**];
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
ON CodeWe.*
TO `codewe_python_api`;
