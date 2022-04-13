-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema assetingdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema assetingdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `assetingdb` DEFAULT CHARACTER SET utf8 ;
USE `assetingdb` ;

-- -----------------------------------------------------
-- Table `assetingdb`.`escritorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`escritorio` (
  `cod_escritorio` INT(11) NOT NULL AUTO_INCREMENT,
  `morada` VARCHAR(100) NULL DEFAULT NULL,
  `tipo` VARCHAR(45) NULL DEFAULT NULL,
  `helpdesk` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_escritorio`),
  UNIQUE INDEX `morada` (`morada` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`conta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`conta` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `apelido` VARCHAR(45) NOT NULL,
  `pass` CHAR(255) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `grupo` ENUM('Coordenador', 'Administrador') NULL DEFAULT 'Coordenador',
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC),
  UNIQUE INDEX `email` (`email` ASC),
  INDEX `cod_escritorio` (`cod_escritorio` ASC),
  CONSTRAINT `conta_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_computador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_computador` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(20) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`computador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`computador` (
  `nr_serie` VARCHAR(30) NOT NULL,
  `username` INT(11) NULL DEFAULT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `cod_tipo` INT(11) NULL DEFAULT NULL,
  `marca` VARCHAR(20) NULL DEFAULT NULL,
  `modelo` VARCHAR(20) NULL DEFAULT NULL,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  `so` VARCHAR(20) NULL DEFAULT NULL,
  `spack` VARCHAR(20) NULL DEFAULT NULL,
  `cpu` VARCHAR(20) NULL DEFAULT NULL,
  `ram` VARCHAR(20) NULL DEFAULT NULL,
  `hdd` VARCHAR(20) NULL DEFAULT NULL,
  `garantia` DATE NULL DEFAULT NULL,
  `data_instalacao` DATE NULL DEFAULT NULL,
  `fim_emprestimo` DATE NULL DEFAULT NULL,
  `aviso` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`nr_serie`),
  INDEX `username` (`username` ASC),
  INDEX `cod_escritorio` (`cod_escritorio` ASC),
  INDEX `cod_tipo` (`cod_tipo` ASC),
  CONSTRAINT `computador_ibfk_1`
    FOREIGN KEY (`username`)
    REFERENCES `assetingdb`.`conta` (`id`),
  CONSTRAINT `computador_ibfk_2`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`),
  CONSTRAINT `computador_ibfk_3`
    FOREIGN KEY (`cod_tipo`)
    REFERENCES `assetingdb`.`tipo_computador` (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_rede`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_rede` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`disp_rede`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`disp_rede` (
  `nr_serie` VARCHAR(30) NOT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `cod_tipo` INT(11) NULL DEFAULT NULL,
  `fabricante` VARCHAR(20) NULL DEFAULT NULL,
  `modelo` VARCHAR(45) NULL DEFAULT NULL,
  `ipv4` VARCHAR(15) NULL DEFAULT NULL,
  `ipv6` VARCHAR(39) NULL DEFAULT NULL,
  `manutencao` DATE NULL DEFAULT NULL,
  `nota` VARCHAR(100) NULL DEFAULT NULL,
  `aviso` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`nr_serie`),
  INDEX `cod_escritorio` (`cod_escritorio` ASC),
  INDEX `cod_tipo` (`cod_tipo` ASC),
  CONSTRAINT `disp_rede_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`),
  CONSTRAINT `disp_rede_ibfk_2`
    FOREIGN KEY (`cod_tipo`)
    REFERENCES `assetingdb`.`tipo_rede` (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_moveis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_moveis` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`equip_moveis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`equip_moveis` (
  `nr_serie` VARCHAR(20) NOT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `username` INT(11) NULL DEFAULT NULL,
  `cod_tipo` INT(11) NULL DEFAULT NULL,
  `marca` VARCHAR(20) NULL DEFAULT NULL,
  `modelo` VARCHAR(20) NULL DEFAULT NULL,
  `contacto` VARCHAR(9) NULL DEFAULT NULL,
  `imei1` VARCHAR(45) NULL DEFAULT NULL,
  `imei2` VARCHAR(45) NULL DEFAULT NULL,
  `data_entrega` DATE NULL DEFAULT NULL,
  `garantia` DATE NULL DEFAULT NULL,
  `fim_emprestimo` DATE NULL DEFAULT NULL,
  `nota` VARCHAR(100) NULL DEFAULT NULL,
  `aviso` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`nr_serie`),
  INDEX `cod_escritorio` (`cod_escritorio` ASC) ,
  INDEX `username` (`username` ASC) ,
  INDEX `cod_tipo` (`cod_tipo` ASC) ,
  CONSTRAINT `equip_moveis_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`),
  CONSTRAINT `equip_moveis_ibfk_2`
    FOREIGN KEY (`username`)
    REFERENCES `assetingdb`.`conta` (`id`),
  CONSTRAINT `equip_moveis_ibfk_3`
    FOREIGN KEY (`cod_tipo`)
    REFERENCES `assetingdb`.`tipo_moveis` (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_servidor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_servidor` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(15) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`servidor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`servidor` (
  `nr_serie` VARCHAR(30) NOT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `cod_tipo` INT(11) NULL DEFAULT NULL,
  `fabricante` VARCHAR(20) NULL DEFAULT NULL,
  `modelo` VARCHAR(20) NULL DEFAULT NULL,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  `so` VARCHAR(20) NULL DEFAULT NULL,
  `cpu` VARCHAR(20) NULL DEFAULT NULL,
  `ram` VARCHAR(20) NULL DEFAULT NULL,
  `hdd` VARCHAR(20) NULL DEFAULT NULL,
  `nic` VARCHAR(30) NULL DEFAULT NULL,
  `ipv4` VARCHAR(15) NULL DEFAULT NULL,
  `ipv6` VARCHAR(39) NULL DEFAULT NULL,
  `garantia` DATE NULL DEFAULT NULL,
  `manutencao` DATE NULL DEFAULT NULL,
  `outro` VARCHAR(100) NULL DEFAULT NULL,
  `aviso` TINYINT(1) NULL DEFAULT 0,
  PRIMARY KEY (`nr_serie`),
  INDEX `cod_escritorio` (`cod_escritorio` ASC) ,
  INDEX `cod_tipo` (`cod_tipo` ASC) ,
  CONSTRAINT `servidor_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`),
  CONSTRAINT `servidor_ibfk_2`
    FOREIGN KEY (`cod_tipo`)
    REFERENCES `assetingdb`.`tipo_servidor` (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_software`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_software` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`tipo_licenca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`tipo_licenca` (
  `cod_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`software`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`software` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nr_serie` VARCHAR(45) NULL DEFAULT NULL,
  `cod_tipo_software` INT(11) NULL DEFAULT NULL,
  `cod_tipo_licenca` INT(11) NULL DEFAULT NULL,
  `nr_serie_computador` VARCHAR(30) NULL DEFAULT NULL,
  `nr_serie_servidor` VARCHAR(30) NULL DEFAULT NULL,
  `fabricante` VARCHAR(20) NULL DEFAULT NULL,
  `versao` VARCHAR(20) NULL DEFAULT NULL,
  `descricao` VARCHAR(100) NULL DEFAULT NULL,
  `chave` VARCHAR(45) NULL DEFAULT NULL,
  `validade` DATE NULL DEFAULT NULL,
  `nota` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nr_serie` (`nr_serie` ASC) ,
  INDEX `cod_tipo_software` (`cod_tipo_software` ASC) ,
  INDEX `cod_tipo_licenca` (`cod_tipo_licenca` ASC) ,
  INDEX `nr_serie_computador` (`nr_serie_computador` ASC) ,
  INDEX `nr_serie_servidor` (`nr_serie_servidor` ASC) ,
  CONSTRAINT `software_ibfk_1`
    FOREIGN KEY (`cod_tipo_software`)
    REFERENCES `assetingdb`.`tipo_software` (`cod_tipo`),
  CONSTRAINT `software_ibfk_2`
    FOREIGN KEY (`cod_tipo_licenca`)
    REFERENCES `assetingdb`.`tipo_licenca` (`cod_tipo`),
  CONSTRAINT `software_ibfk_3`
    FOREIGN KEY (`nr_serie_computador`)
    REFERENCES `assetingdb`.`computador` (`nr_serie`),
  CONSTRAINT `software_ibfk_4`
    FOREIGN KEY (`nr_serie_servidor`)
    REFERENCES `assetingdb`.`servidor` (`nr_serie`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `apelido` VARCHAR(45) NOT NULL,
  `pass` VARCHAR(255) NOT NULL,
  `grupo` VARCHAR(20) NOT NULL,
  `cod_escritorio` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`utilizador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`utilizador` (
  `email` VARCHAR(45) NOT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `nome` VARCHAR(16) NOT NULL,
  `username` INT(11) NULL DEFAULT NULL,
  `telemovel` INT(11) NULL DEFAULT NULL,
  `morada` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`email`),
  INDEX `cod_escritorio` (`cod_escritorio` ASC) ,
  INDEX `username` (`username` ASC) ,
  CONSTRAINT `utilizador_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`),
  CONSTRAINT `utilizador_ibfk_2`
    FOREIGN KEY (`username`)
    REFERENCES `assetingdb`.`conta` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `assetingdb`.`veiculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `assetingdb`.`veiculo` (
  `matricula` VARCHAR(8) NOT NULL,
  `cod_escritorio` INT(11) NULL DEFAULT NULL,
  `marca` VARCHAR(20) NULL DEFAULT NULL,
  `modelo` VARCHAR(20) NULL DEFAULT NULL,
  `cor` VARCHAR(20) NULL DEFAULT NULL,
  `vin` VARCHAR(45) NULL DEFAULT NULL,
  `garantia` DATE NULL DEFAULT NULL,
  `nota` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`matricula`),
  INDEX `cod_escritorio` (`cod_escritorio` ASC) ,
  CONSTRAINT `veiculo_ibfk_1`
    FOREIGN KEY (`cod_escritorio`)
    REFERENCES `assetingdb`.`escritorio` (`cod_escritorio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

create table token(
  `id` int primary key auto_increment,
  `hash` varchar(255) not null,
  `username` varchar(16) not null
);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
