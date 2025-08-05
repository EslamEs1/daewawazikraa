CREATE TABLE IF NOT EXISTS `shared_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasbih_do3aa` int(11) DEFAULT 0,
  `tasbih_tasbeh` int(11) DEFAULT 0,
  `tasbih_hamd` int(11) DEFAULT 0,
  `tasbih_takbeer` int(11) DEFAULT 0,
  `interactions_surah_gifts` int(11) DEFAULT 0,
  `interactions_prayers` int(11) DEFAULT 0,
  `interactions_juz_reads` int(11) DEFAULT 0,
  `quran_total_readings` int(11) DEFAULT 0,
  `quran_completed_khatmat` int(11) DEFAULT 0,
  `quran_read_surahs` text DEFAULT NULL,
  `last_update` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shared_data` (`id`, `tasbih_do3aa`, `tasbih_tasbeh`, `tasbih_hamd`, `tasbih_takbeer`, `interactions_surah_gifts`, `interactions_prayers`, `interactions_juz_reads`, `quran_total_readings`, `quran_completed_khatmat`, `quran_read_surahs`) 
VALUES (1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '[]') 
ON DUPLICATE KEY UPDATE id=id;