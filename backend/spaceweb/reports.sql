CREATE TABLE IF NOT EXISTS bug_reports (
  id CHAR(36) PRIMARY KEY,
  created_at VARCHAR(30) NOT NULL,
  category VARCHAR(20) NOT NULL,
  nick VARCHAR(240) NOT NULL,
  report_json MEDIUMTEXT NOT NULL,
  INDEX (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
