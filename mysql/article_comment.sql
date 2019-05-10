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

 Date: 10/05/2019 01:01:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_comment
-- ----------------------------
DROP TABLE IF EXISTS `article_comment`;
CREATE TABLE `article_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `content` varchar(255) NOT NULL COMMENT '评论内容',
  `time` bigint(20) NOT NULL COMMENT '评论时间',
  `article_id` int(11) NOT NULL COMMENT '文章id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `like_num` int(11) NOT NULL DEFAULT '0' COMMENT '点赞评论数',
  `comment_num` int(11) NOT NULL DEFAULT '0' COMMENT '回复评论数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article_comment
-- ----------------------------
BEGIN;
INSERT INTO `article_comment` VALUES (1094, 'test1', 1557401866523, 1072, 1031, 0, 0);
INSERT INTO `article_comment` VALUES (1103, '这篇文章写得真好！', 1557409674732, 1072, 1031, 0, 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
