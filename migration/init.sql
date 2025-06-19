USE react_ploclo;

CREATE TABLE `course` (
  `course_id` int NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `course_engname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`course_id`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `clo` (
  `CLO_id` int NOT NULL AUTO_INCREMENT,
  `CLO_code` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `CLO_name` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `CLO_engname` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course_id` INT NOT NULL,
  `year` INT(4),
  `timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`CLO_id`),
  FOREIGN KEY (`course_id`) REFERENCES `course`(`course_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `plo` (
  `PLO_id` int NOT NULL AUTO_INCREMENT,
  `PLO_code` varchar(1000) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `PLO_name` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `PLO_engname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PLO_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `program` (
  `code` VARCHAR(50),
  `program_id` int NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `program_name_th` VARCHAR(255),
  `year` INT(4),
  `program_shortname_en` VARCHAR(50),
  `program_shortname_th` VARCHAR(50),
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `role` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `section` (
  `section_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `semester` (
  `semester_id` int NOT NULL AUTO_INCREMENT,
  `semester_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`semester_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `course_clo` (
  `course_clo_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `clo_id` int NOT NULL,
  `semester_id` int NOT NULL,
  `section_id` int NOT NULL,
  `year` int DEFAULT NULL,
  `weight` INT DEFAULT 0,
  PRIMARY KEY (`course_clo_id`),
  KEY `course_id` (`course_id`),
  KEY `clo_id` (`clo_id`),
  KEY `semester_id` (`semester_id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `course_clo_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE,
  CONSTRAINT `course_clo_ibfk_2` FOREIGN KEY (`clo_id`) REFERENCES `clo` (`CLO_id`) ON DELETE CASCADE,
  CONSTRAINT `course_clo_ibfk_3` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`semester_id`) ON DELETE CASCADE,
  CONSTRAINT `course_clo_ibfk_4` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `course_plo` (
  `course_plo_id` int NOT NULL AUTO_INCREMENT,
  `weight` int NOT NULL,
  `plo_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`course_plo_id`),
  KEY `plo_id` (`plo_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_plo_ibfk_1` FOREIGN KEY (`plo_id`) REFERENCES `plo` (`PLO_id`),
  CONSTRAINT `course_plo_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `program_course` (
  `program_course_id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `semester_id` int NOT NULL,
  `course_id` int NOT NULL,
  `section_id` int NOT NULL,
  `program_id` int NOT NULL,
  PRIMARY KEY (`program_course_id`),
  KEY `semester_id` (`semester_id`),
  KEY `course_id` (`course_id`),
  KEY `section_id` (`section_id`),
  KEY `fk_program_id` (`program_id`),
  CONSTRAINT `program_course_ibfk_1` FOREIGN KEY (`semester_id`) REFERENCES `semester` (`semester_id`),
  CONSTRAINT `program_course_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  CONSTRAINT `program_course_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `program_plo` (
  `program_PLO_id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `plo_id` int NOT NULL,
  PRIMARY KEY (`program_PLO_id`),
  KEY `program_id` (`program_id`),
  KEY `plo_id` (`plo_id`),
  CONSTRAINT `program_plo_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE,
  CONSTRAINT `program_plo_ibfk_2` FOREIGN KEY (`plo_id`) REFERENCES `plo` (`PLO_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `plo_clo` (
  `PLO_CLO_id` int NOT NULL AUTO_INCREMENT,
  `weight` int NOT NULL,
  `PLO_id` int NOT NULL,
  `CLO_id` int NOT NULL,
  PRIMARY KEY (`PLO_CLO_id`),
  CONSTRAINT `plo_clo_ibfk_4` FOREIGN KEY (`PLO_id`) REFERENCES `program_plo` (`plo_id`),
  CONSTRAINT `plo_clo_ibfk_5` FOREIGN KEY (`CLO_id`) REFERENCES `clo` (`CLO_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE university (
    university_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    university_name_en VARCHAR(255) NOT NULL, -- ชื่อมหาวิทยาลัยภาษาอังกฤษ
    university_name_th VARCHAR(255) NOT NULL, -- ชื่อมหาวิทยาลัยภาษาไทย
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE university_program (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    university_id INT(11),  -- เชื่อมไปยังมหาวิทยาลัย
    program_id INT(11),     -- เชื่อมไปยังหลักสูตร
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (university_id) REFERENCES university(university_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES program(program_id) ON DELETE CASCADE
);

CREATE TABLE faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name_th VARCHAR(255) NOT NULL,
	  faculty_name_en VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE university_faculty (
    id INT PRIMARY KEY AUTO_INCREMENT,
    university_id INT(11) NOT NULL,
    faculty_id INT(11) NOT NULL,
    FOREIGN KEY (university_id) REFERENCES university(university_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE program_faculty (
    program_id INT(11) NOT NULL,
    faculty_id INT(11) NOT NULL,
    PRIMARY KEY (program_id, faculty_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `student` (
  `student_id` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `student_course` (
  `student_id` VARCHAR(20) COLLATE utf8mb4_general_ci NOT NULL,
  course_id INT NOT NULL,
  section_id INT,
  FOREIGN KEY (`student_id`) REFERENCES student(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES course(course_id) ON DELETE CASCADE,
  PRIMARY KEY (`student_id`, course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 
CREATE TABLE `student_program` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `student_id` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `program_id` INT,
  FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`program_id`) REFERENCES `program`(`program_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignments` (
  `assignment_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `program_course_id` INT NOT NULL,
  `assignment_name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `total_score` INT,
  `due_date` DATE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `faculty_id` INT NOT NULL,
  `university_id` INT NOT NULL,
  FOREIGN KEY (`program_course_id`) REFERENCES `program_course`(`program_course_id`),
  FOREIGN KEY (`faculty_id`) REFERENCES `faculty`(`faculty_id`),
  FOREIGN KEY (`university_id`) REFERENCES `university`(`university_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignment_clo` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` int NOT NULL,
  `clo_id` int NOT NULL,
  `weight` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`clo_id`) REFERENCES `clo`(`CLO_id`) ON DELETE CASCADE,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE
);

CREATE TABLE `assignment_student` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT NOT NULL,
  `student_id` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `assigned_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` DATETIME,
  `is_submitted` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`assignment_id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `assignment_grade` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `assignment_student_id` INT NOT NULL,
  `score` INT DEFAULT 0,
  `graded_at` DATETIME,
  FOREIGN KEY (`assignment_student_id`) REFERENCES `assignment_student`(`id`) ON DELETE CASCADE
);

ALTER TABLE plo_clo
ADD UNIQUE KEY unique_plo_clo (PLO_id, CLO_id);

-- ข้อมูลเทส
SET NAMES 'utf8mb4';
SET character_set_client = 'utf8mb4';
SET character_set_connection = 'utf8mb4';
SET character_set_results = 'utf8mb4';
INSERT INTO university(university_id, university_name_en, university_name_th)
VALUES (1,"Naresuan University","มหาวิทยาลัยนเรศวร");

INSERT INTO faculty(faculty_id, faculty_name_th, faculty_name_en)
VALUES (1,"Faculty of Engineering","คณะวิศวกรรมศาสตร์");

INSERT INTO university_faculty(id, university_id, faculty_id)
VALUES (1,1,1);

INSERT INTO semester(semester_id, semester_name)
VALUES (1,'ภาคเรียนที่ 1'),(2,'ภาคเรียนที่ 2'),(3,'ภาคเรียนที่3'),(4,'ภาคเรียนที่ 4');

INSERT INTO section()
VALUES (1);
