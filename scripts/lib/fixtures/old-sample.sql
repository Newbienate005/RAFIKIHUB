-- Fictional sample of the old rafikihub.com database, for testing the importer.
-- Column names and value formats follow the old PHP code. No real people.
-- phpMyAdmin SQL Dump
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `roles_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `membership_category` varchar(100) DEFAULT NULL,
  `alt_title` varchar(100) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `date_of_birth` varchar(30) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Unverified',
  `visible` varchar(5) DEFAULT 'Yes',
  `link_url` varchar(100) DEFAULT NULL,
  `billtime` int(11) DEFAULT NULL,
  `is_admin` int(11) DEFAULT 0,
  `website` varchar(255) DEFAULT NULL,
  `agent_bio` text,
  `age_from` int(11) DEFAULT NULL,
  `age_to` int(11) DEFAULT NULL,
  `first_height` varchar(20) DEFAULT NULL,
  `second_height` varchar(20) DEFAULT NULL,
  `appearance` varchar(50) DEFAULT NULL,
  `eye_color` varchar(50) DEFAULT NULL,
  `hair_color` varchar(50) DEFAULT NULL,
  `hair_length` varchar(50) DEFAULT NULL,
  `facial_hair` varchar(50) DEFAULT NULL,
  `voice_quality` varchar(50) DEFAULT NULL,
  `voice_character` varchar(50) DEFAULT NULL,
  `low_note` varchar(50) DEFAULT NULL,
  `medium_note` varchar(50) DEFAULT NULL,
  `high_note` varchar(50) DEFAULT NULL,
  `chest` varchar(20) DEFAULT NULL,
  `waist` varchar(20) DEFAULT NULL,
  `hips` varchar(20) DEFAULT NULL,
  `inside_leg` varchar(20) DEFAULT NULL,
  `inside_arm` varchar(20) DEFAULT NULL,
  `collar` varchar(20) DEFAULT NULL,
  `hat` varchar(20) DEFAULT NULL,
  `weight` varchar(20) DEFAULT NULL,
  `shoe_size` varchar(20) DEFAULT NULL,
  `dress_size` varchar(20) DEFAULT NULL,
  `id_passport` varchar(50) DEFAULT NULL,
  `tax_pin` varchar(50) DEFAULT NULL,
  `physical_add` varchar(255) DEFAULT NULL,
  `last_login` varchar(30) DEFAULT NULL,
  `pet_type` varchar(30) DEFAULT NULL,
  `pet_breed` varchar(60) DEFAULT NULL,
  `pet_size` varchar(20) DEFAULT NULL,
  `pet_trained` varchar(5) DEFAULT NULL,
  `pet_trained_level` varchar(20) DEFAULT NULL,
  `pet_skills` varchar(200) DEFAULT NULL,
  `pet_personality` varchar(20) DEFAULT NULL,
  `created_at` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `status`, `visible`, `link_url`, `is_admin`, `created_at`) VALUES (1,1,'Site Admin','admin@example.test','5f4dcc3b5aa765d61d8327deb882cf99','Kenya','+254','700000001','Admin','Active','NO','admin1',1,'2021-01-01 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `alt_title`, `date_of_birth`, `status`, `visible`, `link_url`, `billtime`, `website`, `agent_bio`, `last_login`, `created_at`) VALUES (2,2,'Kioko Casting','Casting@Example.test','e10adc3949ba59abbe56e057f20f883e','Kenya','+254','711111111','Casting Director','Head of Casting','2021-03-01 09:00:00','Active','Yes','cast2xyzab',12,'https://kiokocasting.example','<p>We cast <strong>film</strong> &amp; TV.</p>','2024-05-01 08:00:00','2021-03-01 09:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `gender`, `date_of_birth`, `status`, `visible`, `link_url`, `billtime`, `website`, `agent_bio`, `age_from`, `age_to`, `first_height`, `second_height`, `appearance`, `eye_color`, `hair_color`, `hair_length`, `facial_hair`, `voice_quality`, `voice_character`, `low_note`, `medium_note`, `high_note`, `chest`, `waist`, `hips`, `inside_leg`, `inside_arm`, `collar`, `hat`, `weight`, `shoe_size`, `dress_size`, `id_passport`, `tax_pin`, `physical_add`, `last_login`, `created_at`) VALUES (3,3,'WanjirÅ© Mwangi','wanjiru@example.test','25d55ad283aa400af464c76d713c07ad','Kenya','+254','722222222','Actress','Female','1995-06-15 00:00:00','Active','Yes','Wanj3AbCdE',6,'NULL','Actress and dancer based in Nairobi.',22,30,'5 feet','6 inches','Black-African','dark brown','Black','Locs','NULL','Warm','Friendly','Alto F3 - D5','','','34 inches','26 inches','36 inches','30 inches','NULL','','','58','5','10','12345678','A00TAXPIN','Ngong Road','2024-06-01 12:00:00','2022-02-02 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `date_of_birth`, `status`, `visible`, `link_url`, `created_at`) VALUES (4,3,'Wanjiru Mwangi (old)','WANJIRU@example.test','25d55ad283aa400af464c76d713c07ad','Kenya','+254','722222222','Actress','1995-06-15','Unverified','Yes','oldwanj4zz','2021-01-01 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `gender`, `date_of_birth`, `status`, `visible`, `link_url`, `billtime`, `age_from`, `age_to`, `first_height`, `second_height`, `created_at`) VALUES (5,4,'Otieno Grip','otieno@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','0','733333333','Make-Up Artist','Male','0000-00-00','Active','NO','otie5QwErT',1,25,35,'175 cm','','2023-03-03 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `date_of_birth`, `status`, `visible`, `link_url`, `agent_bio`, `pet_type`, `pet_breed`, `pet_size`, `pet_trained`, `pet_trained_level`, `pet_skills`, `pet_personality`, `created_at`) VALUES (6,5,'Simba the Dog','simba@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','+254','744444444','Pet','2019-01-01 00:00:00','Active','Yes','simba6PeTs','Good boy.','Dog','Rhodesian Ridgeback','Large','Yes','Intermediate','Fetch Roll Over Retreive Sit Down ','Calm','2023-04-04 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `status`, `visible`, `link_url`, `created_at`) VALUES (7,6,'Studio Space Ltd','studio@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','+254','755555555','Rooms and Studio','Active','Yes','studio7aaa','2023-05-05 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `code`, `phone`, `membership_category`, `status`, `visible`, `link_url`, `created_at`) VALUES (8,3,'No Email Person','','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','+254','766666666','Actor','Active','Yes','noemail8xx','2023-06-06 10:00:00');

INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `membership_category`, `status`, `visible`, `link_url`, `created_at`) VALUES (9,3,'Achieng Otieno','achieng@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','Actress','Active','Yes','','2024-01-01 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `membership_category`, `status`, `visible`, `link_url`, `created_at`) VALUES (10,3,'Wanjirũ Mwangi','wanjiru2@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','Actress','Active','Yes','wanjiru@home','2024-01-02 10:00:00');
INSERT INTO `users` (`id`, `roles_id`, `name`, `email`, `password`, `country`, `membership_category`, `status`, `visible`, `link_url`, `created_at`) VALUES (11,3,'Baraka Odhiambo','baraka@example.test','d8578edf8458ce06fbc5bb76a58c5ca4','Kenya','Actor','Active','Yes','-baraka_ke','2024-01-03 10:00:00');

CREATE TABLE `cities` (`id` int(11) NOT NULL, `name` varchar(100), `user_id` int(11));
INSERT INTO `cities` VALUES (1,'Nairobi',3),(2,'Mombasa',3),(3,'Kisumu',99);
CREATE TABLE `nationalities` (`id` int(11) NOT NULL, `name` varchar(100), `user_id` int(11));
INSERT INTO `nationalities` VALUES (1,'Kenyan',3);
CREATE TABLE `traits` (`id` int(11) NOT NULL, `name` varchar(50), `location` varchar(100), `user_id` int(11));
INSERT INTO `traits` VALUES (1,'Tatoo','Left wrist',3),(2,'Unicorn horn','Head',3);
CREATE TABLE `skills` (`id` int(11) NOT NULL, `name` varchar(100), `proficiency` varchar(50), `type` varchar(30), `user_id` int(11), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `skills` VALUES (1,'Swahili','Native','Language',3,NULL,NULL),(2,'English','High Standard','Language',3,NULL,NULL),(3,'Kikuyu','Native','Dialect',3,NULL,NULL),(4,'Contemporary dance','High Standard','Perfomance',3,NULL,NULL);
CREATE TABLE `credits` (`id` int(11) NOT NULL, `production_name` varchar(200), `production_type` varchar(50), `production_year` varchar(4), `role` varchar(100), `company` varchar(100), `director` varchar(100), `user_id` int(11), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `credits` VALUES (1,'Mama Mboga','Television','2021','Neema','Some Studio','Jane Director',3,NULL,NULL),(2,'Short Rains','Feature Film','2023','Lead','Indie Co',NULL,3,NULL,NULL),(3,'Bad year','Stage','19','Extra',NULL,NULL,3,NULL,NULL);
CREATE TABLE `training` (`id` int(11) NOT NULL, `course_name` varchar(200), `institution_name` varchar(200), `date_started` varchar(10), `date_ended` varchar(10), `user_id` int(11), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `training` VALUES (1,'Diploma in Theatre','Kenya National Theatre','2015','2017',3,NULL,NULL),(2,'Screen acting','RafikiHub Workshop','2024','Ongoing',3,NULL,NULL);
CREATE TABLE `photos` (`id` int(11) NOT NULL, `name` varchar(100), `user_id` int(11), `box_id` varchar(100), `status` int(11), `taker` varchar(100), `profile` int(11) DEFAULT 0);
INSERT INTO `photos` VALUES (10,'1700000001003.png',3,'myCheckbox1',1,'Photographer A',0),(11,'1700000002003.png',3,'myCheckbox2',1,'Photographer A',1),(12,'1700000003003.png',3,'myCheckbox3',0,'Photographer B',0);
CREATE TABLE `videos` (`id` int(11) NOT NULL, `name` varchar(100), `title` varchar(100), `user_id` int(11), `box_id` varchar(100), `extension` varchar(10));
INSERT INTO `videos` VALUES (1,'1700000004003.mp4','Showreel 2024',3,'myReel1','mp4');
CREATE TABLE `voices` (`id` int(11) NOT NULL, `name` varchar(100), `title` varchar(100), `user_id` int(11), `box_id` varchar(100), `extension` varchar(10));
CREATE TABLE `files` (`id` int(11) NOT NULL, `name` varchar(100), `name_without_extension` varchar(100), `type` varchar(50), `extension` varchar(10), `status` varchar(20), `user_id` int(11), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `files` VALUES (1,'abc.pdf','abc.pdf','User ID/Passport','pdf','Approved',3,NULL,NULL);

CREATE TABLE `auditions` (`id` int(11) NOT NULL, `title` varchar(255), `random_id` varchar(50), `type` varchar(100), `gender` varchar(20), `body` text, `user_id` int(11), `close_date` varchar(30), `status` int(11) DEFAULT 0, `created_at` varchar(30), `updated_at` varchar(30));
INSERT INTO `auditions` VALUES
(100,'Lead for a feature film','RH2-150101','Feature Film','Female','<h2>The role</h2><p>Neema, 25&ndash;30.</p><p>Paid.</p>',2,'2099-12-31',0,'2024-04-01 09:00:00',NULL),
(101,'TV commercial','RH2-160202','Commercial','Everybody','<p>Old casting.</p>',2,'2022-01-01 00:00:00',1,'2021-12-01 09:00:00',NULL),
(102,'Orphan casting','RH9-1','Other','Male','<p>Owner deleted.</p>',999,'2099-01-01',0,'2024-01-01 09:00:00',NULL);
CREATE TABLE `talent_categories` (`id` int(11) NOT NULL, `talent_id` int(11), `name` varchar(100));
INSERT INTO `talent_categories` VALUES (1,100,'Actress'),(2,100,'Independent/Untrained Performer'),(3,101,'All Categories');
CREATE TABLE `talent_countries` (`id` int(11) NOT NULL, `talent_id` int(11), `name` varchar(100));
INSERT INTO `talent_countries` VALUES (1,100,'Kenya'),(2,101,'All Countries');
CREATE TABLE `auditions_applications` (`id` int(11) NOT NULL, `title` varchar(255), `random_id` varchar(50), `applicant_name` varchar(255), `type` varchar(100), `gender` varchar(20), `body` text, `status` int(11), `user_id` int(11), `owner_id` int(11), `audition_id` int(11), `close_date` varchar(30), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `auditions_applications` VALUES (1,'Lead for a feature film','RH2-150101','Wanjiru Mwangi','Feature Film','Female','<p>…</p>',0,3,2,100,'2099-12-31',NULL,'2024-04-02 10:00:00'),(2,'Lead for a feature film','RH2-150101','Wanjiru Mwangi','Feature Film','Female','<p>…</p>',0,3,2,100,'2099-12-31',NULL,'2024-04-02 11:00:00'),(3,'x','x','Ghost','x','x','x',0,555,2,100,NULL,NULL,'2024-04-02 11:00:00');
CREATE TABLE `agents` (`id` int(11) NOT NULL, `name` varchar(255), `email` varchar(255), `country` varchar(100), `user_id` int(11), `agent_id` int(11), `status` varchar(20), `my_name` varchar(255), `my_phone` varchar(30), `my_email` varchar(255), `my_country` varchar(100), `visible` varchar(5), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `agents` VALUES (1,'Kioko Casting','casting@example.test','Kenya',3,2,'APPROVED','Wanjiru','722222222','wanjiru@example.test','Kenya','YES',NULL,'2024-01-01 10:00:00');
CREATE TABLE `billing` (`id` int(11) NOT NULL, `userid` int(11), `type` varchar(20), `amount` varchar(20), `transactionid` varchar(100), `phone` varchar(20), `paydate` varchar(30), `transactionreference` varchar(100), `rafikireference` varchar(100), `created_at` varchar(30));
INSERT INTO `billing` VALUES (1,3,'MPesa','1250','REQ123','254722222222','2024-02-01 10:00:00','QWE123RTY','RAF3abcde','2024-02-01 10:00:00'),(2,3,'MPesa','250','REQ124','254722222222',NULL,NULL,'RAF3fghij','2024-03-01 10:00:00');
CREATE TABLE `payment_history` (`id` int(11) NOT NULL, `name` varchar(255), `token` varchar(100), `amount` varchar(20), `cycle` varchar(20), `status` varchar(20), `user_id` int(11), `created_at` varchar(30));
INSERT INTO `payment_history` VALUES (1,'Wanjiru','TOK1','2500','12','SUCCESS',3,'2023-01-01 10:00:00');
CREATE TABLE `services` (`id` int(11) NOT NULL, `firstname` varchar(100), `lastname` varchar(100), `phone` varchar(30), `email` varchar(255), `service` varchar(100), `sdate` varchar(30), `cdate` varchar(30), `status` varchar(20), `updated_at` varchar(30), `created_at` varchar(30));
INSERT INTO `services` VALUES (1,'Amina','Hassan','0712000000','amina@example.test','Headshots','2024-07-01T10:30','2024-07-01T10:30','SCHEDULED',NULL,'2024-06-20 09:00:00');
CREATE TABLE `locations` (`id` int(11) NOT NULL, `organization` varchar(255), `email` varchar(255), `country` varchar(100), `phone` varchar(30), `nature` varchar(255), `crew` int(11), `from_date` varchar(30), `to_date` varchar(30), `location_info` varchar(255), `more_information` text, `status` varchar(20), `created_at` varchar(30));
INSERT INTO `locations` VALUES (1,'Blue Hills Films','films@example.test','UK','+44 20 0000','Feature film',25,'2024-09-01T08:00','2024-09-20T18:00','Savanna farmhouse','<p>Need power &amp; water.</p>','PENDING','2024-06-01 09:00:00');
CREATE TABLE `location_services` (`id` int(11) NOT NULL, `service` varchar(100), `location_id` int(11));
INSERT INTO `location_services` VALUES (1,'Permits',1),(2,'Local crew',1);
CREATE TABLE `blog` (`id` int(11) NOT NULL, `title` varchar(255), `slug` varchar(255), `image` varchar(100), `author` varchar(20), `category` varchar(20), `status` varchar(20), `body` text, `writter` varchar(100), `writter_url` varchar(255), `source` varchar(100), `source_url` varchar(255), `created_at` varchar(30), `updated_at` varchar(30));
INSERT INTO `blog` VALUES (3,'Untitled Slug Post','','','Admin','Article','Published','<p>No slug on the old site.</p>',NULL,NULL,NULL,NULL,'2023-08-01 10:00:00',NULL),(1,'Conversations with the Collective','conversations-with-the-collective','1685700000001','Admin','Article','Published','<p>A mental health initiative with AFFC.</p><h3>Why it matters</h3><p>Artists&#39; wellbeing.</p>','RafikiHub Team',NULL,NULL,NULL,'2023-06-02 10:00:00',NULL),(2,'Draft post','draft-post','','Admin','Talent','Unpublished','<p>Not ready.</p>',NULL,NULL,NULL,NULL,'2023-07-01 10:00:00',NULL);
CREATE TABLE `classes` (`id` int(11) NOT NULL, `title` varchar(255), `link` varchar(255), `source` varchar(20), `image` varchar(100), `status` varchar(20), `category` varchar(50), `extension` varchar(20), `created_at` varchar(30));
INSERT INTO `classes` VALUES (1,'How to sign up','https://www.youtube.com/embed/TT2MXJxzsfw','Youtube','1.png','Published','How To Videos','Youtube','2021-10-20 10:00:00');
