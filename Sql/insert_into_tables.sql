USE `ccp2_gest_mission_candidat`;

INSERT INTO `users` (email, `password`, surname, `name`, `role`) VALUES
('pepito@gmail.com', 'amigo123', 'amigo', 'pepito', 'benevole'),
('burito@outlook.com', 'tacos0ss99', 'tartino', 'burito', 'association');

INSERT INTO `association` (`name`) VALUES
('France travail'),
('MAC Donald');

INSERT INTO mission (fk_association, title, `description`, `date`) VALUES 
(2,'Making hamburgers', 'Bread, salad, steak, tomato, cheese, onions... mMMmm', '2025-09-15'),
(1,'Constructeur', 'Architecturage et Construction de maisons,', '2025-11-11');

INSERT INTO candidate (fk_user, fk_mission) VALUES
(1,1),
(2,2);