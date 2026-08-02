-- Online Voting System — normalized schema with proper constraints & indexes.
-- Run this once against an empty database named per DB_NAME in your .env.

CREATE DATABASE IF NOT EXISTS online_voting_system
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE online_voting_system;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    phone         VARCHAR(20)  NULL,
    password      VARCHAR(255) NOT NULL,
    role          ENUM('voter', 'admin') NOT NULL DEFAULT 'voter',
    status        ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- elections
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS elections (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(150) NOT NULL,
    description   TEXT NOT NULL,
    start_date    DATETIME NOT NULL,
    end_date      DATETIME NOT NULL,
    status        ENUM('upcoming', 'active', 'completed') NOT NULL DEFAULT 'upcoming',
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_election_dates CHECK (end_date > start_date),
    INDEX idx_elections_status (status),
    INDEX idx_elections_dates (start_date, end_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- candidates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidates (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    election_id   INT NOT NULL,
    name          VARCHAR(100) NOT NULL,
    party         VARCHAR(100) NOT NULL,
    symbol        VARCHAR(50)  NOT NULL,
    photo         VARCHAR(255) NULL,
    manifesto     TEXT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_election FOREIGN KEY (election_id)
        REFERENCES elections(id) ON DELETE CASCADE,
    INDEX idx_candidates_election (election_id),
    INDEX idx_candidates_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- votes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS votes (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    election_id   INT NOT NULL,
    candidate_id  INT NOT NULL,
    voted_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vote_election FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
    CONSTRAINT fk_vote_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    -- Enforces one-person-one-vote per election at the database level,
    -- as the final safety net beneath the application-level check.
    UNIQUE KEY uq_user_election (user_id, election_id),
    INDEX idx_votes_election (election_id),
    INDEX idx_votes_candidate (candidate_id),
    INDEX idx_votes_voted_at (voted_at)
) ENGINE=InnoDB;

-- No hardcoded admin credentials are seeded here (a fixed password hash in
-- version control is a security smell). Create your first admin by running
-- `npm run seed:admin` (see database/seedAdmin.js) after installing
-- dependencies, or register a normal account and promote it manually:
--   UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
