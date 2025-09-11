USE `ccp2_gest_mission_candidat`;

CREATE TABLE IF NOT EXISTS `users` (
	id_user INT PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(150) NOT NULL,
	surname VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL,
	`role` ENUM('benevole','association') NOT NULL
);

CREATE TABLE IF NOT EXISTS `association` (
	id_association INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL 
);

CREATE TABLE IF NOT EXISTS `mission` (
	id_mission INT PRIMARY KEY AUTO_INCREMENT,
	title VARCHAR(100) NOT NULL,
	description TEXT NOT NULL,
	`date` DATE DEFAULT CURRENT_DATE(),
	fk_association INT NOT NULL,
	UNIQUE(title, description),
	CONSTRAINT fk_association FOREIGN KEY (fk_association) REFERENCES association (id_association)
);

CREATE TABLE IF NOT EXISTS `candidate` (
	id_candidate INT PRIMARY KEY AUTO_INCREMENT,
	status ENUM('accepted','pending','refused') DEFAULT 'pending',
	fk_user INT NOT NULL,
	fk_mission INT NOT NULL,
	UNIQUE(fk_user, fk_mission),
	CONSTRAINT fk_user FOREIGN KEY (fk_user) REFERENCES `users`(id_user),
	CONSTRAINT fk_mission FOREIGN KEY (fk_mission) REFERENCES mission (id_mission)
);

