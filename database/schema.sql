-- =====================================================================
-- University of Swat - website database (MySQL 8)
--
-- Run:  mysql -u root -p < database/schema.sql
--
-- Scope: the academic directory (campuses, faculties, departments,
-- degree types, programmes) plus the site's editorial content
-- (news, announcements, events, tenders, jobs) and static pages.
--
-- PROVENANCE: every programme row carries `source_url` pointing at the
-- uswat.edu.pk page the record was taken from. Programme records are
-- only seeded where the university publishes them; nothing is invented.
-- =====================================================================

DROP DATABASE IF EXISTS uswat;
CREATE DATABASE uswat
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE uswat;

-- ---------------------------------------------------------------------
-- Lookup: campuses
-- ---------------------------------------------------------------------
CREATE TABLE campuses (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(160) NOT NULL,
  slug         VARCHAR(160) NOT NULL,
  location     VARCHAR(200) NULL,
  overview     VARCHAR(600) NULL,
  url          VARCHAR(255) NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_campuses_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Lookup: faculties (the university's own groupings, e.g.
-- "Physical, Numerical and Computational Sciences")
-- ---------------------------------------------------------------------
CREATE TABLE faculties (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(180) NOT NULL,
  slug         VARCHAR(180) NOT NULL,
  short_name   VARCHAR(80)  NULL,
  overview     VARCHAR(600) NULL,
  url          VARCHAR(255) NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_faculties_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Lookup: departments / institutes / centres
-- ---------------------------------------------------------------------
CREATE TABLE departments (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(190) NOT NULL,
  slug         VARCHAR(190) NOT NULL,
  faculty_id   INT UNSIGNED NOT NULL,
  campus_id    INT UNSIGNED NOT NULL,
  overview     VARCHAR(900) NULL,
  url          VARCHAR(255) NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_departments_slug (slug),
  KEY idx_departments_faculty (faculty_id),
  KEY idx_departments_campus (campus_id),
  CONSTRAINT fk_departments_faculty FOREIGN KEY (faculty_id)
    REFERENCES faculties (id) ON DELETE RESTRICT,
  CONSTRAINT fk_departments_campus FOREIGN KEY (campus_id)
    REFERENCES campuses (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Lookup: degree types
--   level      drives the three counters (UG / MS-MPhil / Doctorate)
--   badge_key  drives the badge colour on the client:
--              'red' | 'green' | 'red-accent' | 'green-accent'
--            | 'ink' | 'muted' | 'dual'
-- ---------------------------------------------------------------------
CREATE TABLE degree_types (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code         VARCHAR(60)  NOT NULL,   -- "BS", "MS", "MPhil", "PhD" ...
  label        VARCHAR(140) NOT NULL,   -- long label for tooltips
  level        ENUM('Undergraduate','MS/MPhil','Doctorate') NOT NULL,
  badge_key    VARCHAR(40)  NOT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_degree_types_code (code),
  KEY idx_degree_types_level (level, sort_order)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Lookup: keywords (search tags)
-- ---------------------------------------------------------------------
CREATE TABLE keywords (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(80) NOT NULL,
  slug         VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_keywords_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Core: programmes
-- ---------------------------------------------------------------------
CREATE TABLE programs (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(200) NOT NULL,
  title          VARCHAR(220) NOT NULL,
  degree_type_id INT UNSIGNED NOT NULL,
  department_id  INT UNSIGNED NOT NULL,
  campus_id      INT UNSIGNED NOT NULL,
  overview       VARCHAR(700) NOT NULL,   -- short card blurb
  description    MEDIUMTEXT     NULL,     -- longer detail body
  duration       VARCHAR(100)   NULL,     -- "4 years", "2 years"
  admission_note VARCHAR(500)   NULL,     -- only when the university states one
  website_url    VARCHAR(255)   NULL,     -- official page for the programme
  source_url     VARCHAR(255)   NULL,     -- provenance on uswat.edu.pk
  is_active      TINYINT(1)     NOT NULL DEFAULT 1,
  created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_programs_slug (slug),
  KEY idx_programs_degree (degree_type_id),
  KEY idx_programs_department (department_id),
  KEY idx_programs_campus (campus_id),
  FULLTEXT KEY ft_programs_search (title, overview, description),
  CONSTRAINT fk_programs_degree FOREIGN KEY (degree_type_id)
    REFERENCES degree_types (id) ON DELETE RESTRICT,
  CONSTRAINT fk_programs_department FOREIGN KEY (department_id)
    REFERENCES departments (id) ON DELETE RESTRICT,
  CONSTRAINT fk_programs_campus FOREIGN KEY (campus_id)
    REFERENCES campuses (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Junction: programme <-> keywords
-- ---------------------------------------------------------------------
CREATE TABLE program_keywords (
  program_id   INT UNSIGNED NOT NULL,
  keyword_id   INT UNSIGNED NOT NULL,
  PRIMARY KEY (program_id, keyword_id),
  KEY idx_pk_keyword (keyword_id),
  CONSTRAINT fk_pk_program FOREIGN KEY (program_id)
    REFERENCES programs (id) ON DELETE CASCADE,
  CONSTRAINT fk_pk_keyword FOREIGN KEY (keyword_id)
    REFERENCES keywords (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Editorial content: news, announcements, events, tenders, jobs
--   One table with a `category` discriminator: the five sections share
--   exactly the same shape (title, date, link, excerpt, attachment).
-- ---------------------------------------------------------------------
CREATE TABLE content_items (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug           VARCHAR(220) NOT NULL,
  title          VARCHAR(400) NOT NULL,
  category       ENUM('news','announcement','event','tender','job') NOT NULL,
  published_date DATE         NOT NULL,
  excerpt        VARCHAR(700) NULL,
  url            VARCHAR(500) NULL,   -- canonical article on uswat.edu.pk
  image_url      VARCHAR(500) NULL,
  attachment_url VARCHAR(500) NULL,   -- tender / job PDF where one exists
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_content_slug (slug),
  KEY idx_content_category_date (category, published_date DESC)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Homepage counters (the six animated numbers on uswat.edu.pk)
-- ---------------------------------------------------------------------
CREATE TABLE stats (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  stat_key   VARCHAR(60)  NOT NULL,
  label      VARCHAR(80)  NOT NULL,
  stat_value INT UNSIGNED NOT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_stats_key (stat_key)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Static long-form pages (Vice Chancellor's Message, About University)
-- ---------------------------------------------------------------------
CREATE TABLE pages (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(160) NOT NULL,
  title      VARCHAR(220) NOT NULL,
  subtitle   VARCHAR(220) NULL,
  body       MEDIUMTEXT   NOT NULL,
  source_url VARCHAR(255) NULL,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_slug (slug)
) ENGINE=InnoDB;
