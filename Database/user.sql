CREATE TABLE `travigo`.`users` (`username` VARCHAR(20) NOT NULL , `name` VARCHAR(50) NOT NULL , `email` VARCHAR(50) NOT NULL AUTO_INCREMENT , `password` VARCHAR(50) NOT NULL , `address` TEXT NOT NULL , `city` TEXT NOT NULL , `zipcode` VARCHAR(10) NOT NULL , UNIQUE (`username`, `email`)) ENGINE = InnoDB;

ALTER TABLE `users` CHANGE `email` `email` VARCHAR(50) NOT NULL;
ALTER TABLE `users` CHANGE `address` `street` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `users` CHANGE `zipcode` `zip` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;