/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : koa

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 08/05/2019 22:54:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1031, 'XHFk1ndergarten', '1131911308@qq.com', '$2b$10$Exn/RRI8TdFi2059n3zpE.HPHY09XL71Rwe5.jEpuE5x/SZASANfy', 'http://localhost:3000/upload/avatar/1557241841384.png', '1', 'Coding...');
INSERT INTO `users` VALUES (1037, '风魔小次郎1', '791319924@qq.com', '$2b$10$b3EkX91VgyxRUKxUSGUI3e7AugGg4LXQxCsTUmHZZfW8EkhlK29JK', 'http://localhost:3000/upload/avatar/1557307500362.png', '0', 'Focusing');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
