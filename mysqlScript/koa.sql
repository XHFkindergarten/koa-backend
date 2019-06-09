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

 Date: 09/06/2019 19:48:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `group_id` int(11) NOT NULL COMMENT '分组id',
  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '文章内容',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '无标题' COMMENT '文章标题',
  `label_img` varchar(255) DEFAULT NULL COMMENT '标签图',
  `created_at` bigint(255) NOT NULL COMMENT '创建时间',
  `updated_at` bigint(255) NOT NULL COMMENT '更新时间',
  `summary` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '暂无简介' COMMENT '文章简介',
  `comment_num` int(11) NOT NULL DEFAULT '0' COMMENT '评论数',
  `like_num` int(11) NOT NULL DEFAULT '0' COMMENT '喜欢数',
  `view_time` int(11) NOT NULL DEFAULT '0' COMMENT '查看次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1100 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=1113 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for articleGroup
-- ----------------------------
DROP TABLE IF EXISTS `articleGroup`;
CREATE TABLE `articleGroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分组id',
  `name` varchar(255) NOT NULL DEFAULT '默认分组' COMMENT '分组名称',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `createdAt` bigint(255) NOT NULL COMMENT '创建时间',
  `updatedAt` bigint(20) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1028 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for like
-- ----------------------------
DROP TABLE IF EXISTS `like`;
CREATE TABLE `like` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '点赞id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `article_id` int(11) NOT NULL COMMENT '文章id',
  `time` bigint(20) NOT NULL COMMENT '点赞时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1021 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for reply
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '回复Id',
  `comment_id` int(11) NOT NULL COMMENT '评论id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `content` varchar(255) NOT NULL COMMENT '回复内容',
  `time` bigint(20) NOT NULL COMMENT '回复时间',
  `article_id` int(11) NOT NULL COMMENT '文章id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1150 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '键',
  `userId` int(11) NOT NULL COMMENT '用户ID',
  `roleId` int(11) NOT NULL DEFAULT '0' COMMENT '权限ID 0=用户 1=管理员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1032 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `email` varchar(255) NOT NULL COMMENT '注册邮箱',
  `password` varchar(255) NOT NULL COMMENT '用户密码',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `mood` varchar(255) NOT NULL DEFAULT '0' COMMENT '用户的心情状态',
  `sign` varchar(255) NOT NULL DEFAULT 'Focusing' COMMENT '用户签名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1041 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
