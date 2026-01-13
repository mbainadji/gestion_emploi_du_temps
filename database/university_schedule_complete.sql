-- ============================================================
-- FICHIER SQL COMPLET - GESTION EMPLOI DU TEMPS UNIVERSITAIRE
-- Université de Yaoundé I - Faculté des Sciences
-- Département d'Informatique
-- ============================================================

-- Nom de la base de données: university_schedule
-- ============================================================

-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS university_schedule;

-- Créer la base de données
CREATE DATABASE university_schedule CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE university_schedule;

-- ============================================================
-- CRÉATION DES TABLES
-- ============================================================

-- Table des utilisateurs (Admins et Enseignants)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'teacher') NOT NULL DEFAULT 'teacher',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des années académiques
CREATE TABLE academic_years (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des semestres
CREATE TABLE semesters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    academic_year_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    number INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- Table des départements
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    head_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des filières (programmes)
CREATE TABLE programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    level ENUM('Licence', 'Master', 'Doctorat') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Table des classes (promotions)
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL,
    academic_year_id INT NOT NULL,
    student_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

-- Table des salles
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(20),
    room_type ENUM('Amphitheatre', 'Salle TD', 'Salle TP', 'Laboratoire') DEFAULT 'Salle TD',
    has_projector BOOLEAN DEFAULT FALSE,
    has_computers BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des unités d'enseignement (UE/Cours)
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    hours_cm INT DEFAULT 0,
    hours_td INT DEFAULT 0,
    hours_tp INT DEFAULT 0,
    semester INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_course_code (code, program_id)
);

-- Table d'affectation enseignant-cours
CREATE TABLE teacher_courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    course_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    course_type ENUM('CM', 'TD', 'TP') DEFAULT 'CM',
    group_number INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_course (teacher_id, course_id, academic_year_id, course_type, group_number)
);

-- Table des créneaux horaires
CREATE TABLE time_slots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_order INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des séances (emploi du temps)
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    room_id INT NOT NULL,
    semester_id INT NOT NULL,
    time_slot_id INT NOT NULL,
    day_of_week ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi') NOT NULL,
    session_type ENUM('CM', 'TD', 'TP') DEFAULT 'CM',
    group_number INT DEFAULT 1,
    is_recurring BOOLEAN DEFAULT TRUE,
    specific_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE
);

-- Table des périodes de désidératas
CREATE TABLE preference_periods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    semester_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE
);

-- Table des désidératas des enseignants
CREATE TABLE teacher_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    preference_period_id INT NOT NULL,
    day_of_week ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi') NOT NULL,
    time_slot_id INT NOT NULL,
    preference_type ENUM('available', 'unavailable', 'preferred') NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (preference_period_id) REFERENCES preference_periods(id) ON DELETE CASCADE,
    FOREIGN KEY (time_slot_id) REFERENCES time_slots(id) ON DELETE CASCADE,
    UNIQUE KEY unique_preference (teacher_id, preference_period_id, day_of_week, time_slot_id)
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- INDEX POUR OPTIMISATION
-- ============================================================

CREATE INDEX idx_sessions_day ON sessions(day_of_week);
CREATE INDEX idx_sessions_semester ON sessions(semester_id);
CREATE INDEX idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX idx_sessions_class ON sessions(class_id);
CREATE INDEX idx_sessions_room ON sessions(room_id);
CREATE INDEX idx_teacher_courses_teacher ON teacher_courses(teacher_id);
CREATE INDEX idx_teacher_courses_course ON teacher_courses(course_id);
CREATE INDEX idx_teacher_preferences_teacher ON teacher_preferences(teacher_id);

-- ============================================================
-- INSERTION DES DONNÉES DE DÉMONSTRATION
-- Basé sur l'emploi du temps ICT4D-ICTL2 2025-2026
-- ============================================================

-- Créneaux horaires
INSERT INTO time_slots (name, start_time, end_time, slot_order) VALUES
('Matin', '08:00:00', '11:00:00', 1),
('Midi', '11:30:00', '14:30:00', 2),
('Après-midi', '15:00:00', '18:00:00', 3);

-- Année académique 2025-2026
INSERT INTO academic_years (name, start_date, end_date, is_current) VALUES
('2025-2026', '2025-09-01', '2026-07-31', TRUE);

-- Semestres
INSERT INTO semesters (academic_year_id, name, number, start_date, end_date, is_current) VALUES
(1, 'Semestre 1', 1, '2025-09-01', '2026-01-31', TRUE),
(1, 'Semestre 2', 2, '2026-02-01', '2026-07-31', FALSE);

-- Administrateur (mot de passe: admin123 - bcrypt hash)
INSERT INTO users (email, password, first_name, last_name, role, is_active) VALUES
('admin@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Admin', 'Système', 'admin', TRUE);

-- Enseignants ICT4D-ICTL2 (mot de passe: teacher123)
INSERT INTO users (email, password, first_name, last_name, role, phone, is_active) VALUES
('monthe@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'MONTHE', 'teacher', '+237 6XX XXX XX1', TRUE),
('eone@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'EONE', 'teacher', '+237 6XX XXX XX2', TRUE),
('kwette@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'KWETTE', 'teacher', '+237 6XX XXX XX3', TRUE),
('musima@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'MUSIMA', 'teacher', '+237 6XX XXX XX4', TRUE),
('nkondock@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'NKONDOCK', 'teacher', '+237 6XX XXX XX5', TRUE),
('mossebo@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'MOSSEBO', 'teacher', '+237 6XX XXX XX6', TRUE),
('mbous@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'MBOUS', 'teacher', '+237 6XX XXX XX7', TRUE),
('sevany@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'SEVANY', 'teacher', '+237 6XX XXX XX8', TRUE),
('nkouandou@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'NKOUANDOU', 'teacher', '+237 6XX XXX XX9', TRUE),
('biyong@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'BIYONG', 'teacher', '+237 6XX XXX X10', TRUE),
('videme@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'VIDEME', 'teacher', '+237 6XX XXX X11', TRUE),
('ekono@univ-yaounde1.cm', '$2b$10$rQZ8K1PxXMKkXxXxXxXxXeXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', 'Dr.', 'EKONO', 'teacher', '+237 6XX XXX X12', TRUE);

-- Département d'Informatique
INSERT INTO departments (name, code, description, head_id) VALUES
('Département d''Informatique', 'INFO', 'Département d''Informatique de la Faculté des Sciences', 2);

-- Filière ICT4D (Technologies de l''Information et de la Communication pour le Développement)
INSERT INTO programs (department_id, name, code, level, description) VALUES
(1, 'ICT4D - Technologies de l''Information pour le Développement', 'ICT4D', 'Licence', 'Formation en Technologies de l''Information et de la Communication pour le Développement');

-- Classe ICT-L2 (Licence 2)
INSERT INTO classes (program_id, name, level, academic_year_id, student_count) VALUES
(1, 'ICT-L2', 2, 1, 85);

-- Salles S003 et S008
INSERT INTO rooms (name, code, capacity, building, floor, room_type, has_projector) VALUES
('Salle S003', 'S003', 100, 'Bâtiment Principal', 'RDC', 'Salle TD', TRUE),
('Salle S008', 'S008', 100, 'Bâtiment Principal', 'RDC', 'Salle TD', TRUE);

-- Unités d'Enseignement (UE) du semestre 1
INSERT INTO courses (program_id, code, name, credits, hours_cm, hours_td, hours_tp, semester, description) VALUES
(1, 'ICT201', 'Programmation Orientée Objet', 6, 30, 15, 15, 1, 'Introduction à la POO avec Java'),
(1, 'ICT203', 'Bases de Données', 6, 30, 15, 15, 1, 'Conception et manipulation de bases de données'),
(1, 'ICT205', 'Réseaux Informatiques', 6, 30, 15, 15, 1, 'Fondamentaux des réseaux'),
(1, 'ICT207', 'Systèmes d''Exploitation', 6, 30, 15, 15, 1, 'Architecture et fonctionnement des OS'),
(1, 'ICT213', 'Algorithmique Avancée', 6, 30, 15, 15, 1, 'Algorithmes et structures de données avancés'),
(1, 'ICT215', 'Développement Web', 6, 30, 15, 15, 1, 'Technologies web frontend et backend'),
(1, 'ICT217', 'Génie Logiciel', 6, 30, 15, 15, 1, 'Méthodologies de développement logiciel'),
(1, 'ENG203', 'Anglais Technique', 3, 30, 15, 0, 1, 'Anglais pour l''informatique'),
(1, 'FRA203', 'Techniques d''Expression Française', 3, 30, 15, 0, 1, 'Communication professionnelle');

-- Affectations Enseignants-Cours
-- MONTHE: ICT207-G1, ICT207-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(2, 4, 1, 'CM', 1), (2, 4, 1, 'TD', 2);
-- EONE: ICT203-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(3, 2, 1, 'CM', 2);
-- KWETTE: ICT205-G1, ICT205-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(4, 3, 1, 'CM', 1), (4, 3, 1, 'TD', 2);
-- MUSIMA: ENG203-G1, ENG203-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(5, 8, 1, 'CM', 1), (5, 8, 1, 'TD', 2);
-- NKONDOCK: ICT201-G1, ICT201-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(6, 1, 1, 'CM', 1), (6, 1, 1, 'TD', 2);
-- MOSSEBO: ICT213-G1
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(7, 5, 1, 'CM', 1);
-- MBOUS: ICT215-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(8, 6, 1, 'TD', 2);
-- SEVANY: ICT203-G1
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(9, 2, 1, 'CM', 1);
-- NKOUANDOU: ICT217-G1, ICT217-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(10, 7, 1, 'CM', 1), (10, 7, 1, 'TD', 2);
-- BIYONG: FRA203-G1, FRA203-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(11, 9, 1, 'CM', 1), (11, 9, 1, 'TD', 2);
-- VIDEME: ICT215-G1
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(12, 6, 1, 'CM', 1);
-- EKONO: ICT213-G2
INSERT INTO teacher_courses (teacher_id, course_id, academic_year_id, course_type, group_number) VALUES
(13, 5, 1, 'TD', 2);

-- ============================================================
-- EMPLOI DU TEMPS COMPLET ICT-L2 SEMESTRE 1
-- Salle: S003/S008
-- ============================================================

-- LUNDI
-- 11h30-14h30: ICT207-G1 MONTHE
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(4, 2, 1, 1, 1, 2, 'Lundi', 'CM', 1);
-- 15h00-18h00: ICT217-G1 NKOUANDOU
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(7, 10, 1, 1, 1, 3, 'Lundi', 'CM', 1);

-- MARDI
-- 08h00-11h00: ICT207-G2 MONTHE
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(4, 2, 1, 1, 1, 1, 'Mardi', 'TD', 2);
-- 11h30-14h30: ICT201-G1 NKONDOCK
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(1, 6, 1, 1, 1, 2, 'Mardi', 'CM', 1);
-- 15h00-18h00: ENG203-G2 MUSIMA + FRA203-G1 BIYONG
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(8, 5, 1, 1, 1, 3, 'Mardi', 'TD', 2),
(9, 11, 1, 2, 1, 3, 'Mardi', 'CM', 1);

-- MERCREDI
-- 08h00-11h00: ICT203-G2 EONE
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(2, 3, 1, 1, 1, 1, 'Mercredi', 'CM', 2);
-- 11h30-14h30: ICT213-G1 MOSSEBO
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(5, 7, 1, 1, 1, 2, 'Mercredi', 'CM', 1);
-- 15h00-18h00: ICT215-G1 VIDEME
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(6, 12, 1, 1, 1, 3, 'Mercredi', 'CM', 1);

-- JEUDI
-- 08h00-11h00: ICT205-G2 KWETTE
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(3, 4, 1, 1, 1, 1, 'Jeudi', 'TD', 2);
-- 11h30-14h30: ICT215-G2 MBOUS
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(6, 8, 1, 1, 1, 2, 'Jeudi', 'TD', 2);
-- 15h00-18h00: ICT217-G2 NKOUANDOU
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(7, 10, 1, 1, 1, 3, 'Jeudi', 'TD', 2);

-- VENDREDI
-- 08h00-11h00: ICT205-G1 KWETTE
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(3, 4, 1, 1, 1, 1, 'Vendredi', 'CM', 1);
-- 11h30-14h30: ICT201-G2 NKONDOCK
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(1, 6, 1, 1, 1, 2, 'Vendredi', 'TD', 2);
-- 15h00-18h00: ICT213-G2 EKONO
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(5, 13, 1, 1, 1, 3, 'Vendredi', 'TD', 2);

-- SAMEDI
-- 08h00-11h00: ENG203-G1 MUSIMA
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(8, 5, 1, 1, 1, 1, 'Samedi', 'CM', 1);
-- 11h30-14h30: ICT203-G1 SEVANY
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(2, 9, 1, 1, 1, 2, 'Samedi', 'CM', 1);
-- 15h00-18h00: FRA203-G2 BIYONG
INSERT INTO sessions (course_id, teacher_id, class_id, room_id, semester_id, time_slot_id, day_of_week, session_type, group_number) VALUES
(9, 11, 1, 1, 1, 3, 'Samedi', 'TD', 2);

-- Période de saisie des désidératas
INSERT INTO preference_periods (semester_id, name, start_date, end_date, is_active) VALUES
(1, 'Désidératas Semestre 1 - 2025/2026', '2025-08-01 00:00:00', '2025-08-31 23:59:59', TRUE);

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================

SELECT 'Base de données university_schedule créée avec succès!' AS message;
SELECT CONCAT('Utilisateurs: ', COUNT(*)) AS stats FROM users;
SELECT CONCAT('Enseignants: ', COUNT(*)) AS stats FROM users WHERE role = 'teacher';
SELECT CONCAT('Cours (UE): ', COUNT(*)) AS stats FROM courses;
SELECT CONCAT('Séances: ', COUNT(*)) AS stats FROM sessions;
