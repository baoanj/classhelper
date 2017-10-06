# CLASSHLPER(课堂助手)

## 第一阶段

> 项目初始化，复用之前写过的登录注册模块(新增老师、学生两种权限)，建立数据库

## 第二阶段

> 实现 `扫二维码签到` 功能

老师生成一个二维码，学生扫码输入老师要求的信息并提交，老师查看签到情况

## 第三阶段

> 实现 `交作业` 功能

老师创建一个班级并在班级里新建作业，学生添加老师创建的班级并进入查看布置的作业并提交作业，老师下载查看学生的作业并打分，学生查看自己提交的作业的分数

## 数据库(mongoDB)

用户：用户名、邮箱、密码、角色(老师/学生)

签到记录：老师用户名、签到日期、签到信息

班级：ID(数据库自动生成)、班级密码、老师用户名、班级信息

学生-班级联系：学生用户名、班级ID

(老师)布置作业：班级ID、作业日期、作业信息

(学生)提交作业：学生用户名、班级ID、作业日期、提交日期、存储文件名、原文件名、分数

## 用到的框架和库

`Node.js` `Express.js` `express-session` `pug` `Bootstrap` `MongoDB` `qr-image` `bcrypt` `multer`
