var addResizeForTimeline=false;
var timelineArray = [];

//Add rain/delay
//Done=====
//Add translations
//Add substitutions. Who's in/out.


function buildTimeline(game, targetDiv, paddingSides, translationLanguage){
	//Simple function for being able to quickly turn console logging on/off
	var showLog=false;
	function logger (consoleString){
		if (showLog){console.log(consoleString) };
	};


	var language = 'english';

	//This dictionary is created from the translations spreadsheet.
	// http://54.243.239.169/brian/storytelling/translation.html

var dictionary = {"english" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"albanian" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"amharic" : {"yellowCard" : "ቢጫ ካርዶች", "redCard" : "ቀይ ካርዶች", "goal" : "ጎሎች", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"armenian" : {"yellowCard" : "Դեղին քարտ", "redCard" : "Կարմիր քարտ", "goal" : "Գոլ", "ownGoal" : "Գոլ՝ սեփական դարպասների մեջ", "substitution" : "Փոխարինում", "in" : "Մուտք", "out" : "Ելք", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"bosnian" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"chinese" : {"yellowCard" : "黄牌", "redCard" : "红牌", "goal" : "守门员", "ownGoal" : "乌龙球", "substitution" : "换人", "in" : "进", "out" : "出", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"french" : {"yellowCard" : "Carton Jaune", "redCard" : "Carton Rouge", "goal" : "But", "ownGoal" : "But contre son camp", "substitution" : "Remplacement", "in" : "Remplaçant", "out" : "Ôter", "shootout" : "Tirs au but", "scored" : "à marqué", "missed" : "a marqué", "saved" : "a été contré" }, 
"hausa" : {"yellowCard" : "Katin Jan Kunne", "redCard" : "Jan Kati", "goal" : "Cin Kwallaye", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"indonesian" : {"yellowCard" : "Kartu kuning", "redCard" : "Kartu merah", "goal" : "Gol", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"kinyarwanda" : {"yellowCard" : "Amakarita u'umuhondo", "redCard" : "Amakarita aturukura", "goal" : "Ibitego", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"macedonian" : {"yellowCard" : "Жолти картони", "redCard" : "Црвени картони", "goal" : "Постигнати голови", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"ndebele" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"oromoo" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"portuguese" : {"yellowCard" : "Cartão amarelo", "redCard" : "Cartão vermelho", "goal" : "Golo", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"russian" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"spanish" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"serbian" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"shona" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"somali" : {"yellowCard" : "Kaarka Digniinta", "redCard" : "Kaarka Casaanka", "goal" : "Goolasha", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"swahili" : {"yellowCard" : "Kadi Njano", "redCard" : "Kadi Nyekundu", "goal" : "Magoli", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"tigrigna" : {"yellowCard" : "Yellow Card", "redCard" : "Red Card", "goal" : "Goal", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"turkish" : {"yellowCard" : "Sarı Kart", "redCard" : "Kırmızı Kart", "goal" : "Gol", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"ukrainian" : {"yellowCard" : "Жовті картки", "redCard" : "Червоні картки", "goal" : "Голи", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"uzbek" : {"yellowCard" : "Sariq kartochka", "redCard" : "Qizil kartochka", "goal" : "Gollari", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" }, 
"vietnamese" : {"yellowCard" : "Thẻ vàng", "redCard" : "Thẻ đỏ", "goal" : "Bàn thắng", "ownGoal" : "Own Goal", "substitution" : "Substitution", "in" : "In", "out" : "Out", "shootout" : "Shootout", "scored" : "scored", "missed" : "missed", "saved" : "was blocked" } 
}

var countries = {"english" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"albanian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"amharic" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"armenian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"bosnian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"chinese" : {"alg" : "阿尔及利亚", "arg" : "阿根廷", "aus" : "澳大利亚", "bel" : "比利时", "bih" : "波黑", "bra" : "巴西", "cmr" : "喀麦隆", "chi" : "智利", "col" : "哥伦比亚", "crc" : "哥斯达黎加", "cro" : "克罗地亚", "civ" : "科特迪瓦", "ecu" : "厄瓜多尔", "eng" : "英国", "fra" : "法国", "ger" : "德国", "gha" : "加纳", "gre" : "希腊", "hon" : "洪都拉斯", "irn" : "伊朗", "ita" : "意大利", "jpn" : "日本", "mex" : "墨西哥", "ned" : "荷兰", "nga" : "尼日利亚", "por" : "葡萄牙", "rus" : "俄罗斯", "kor" : "韩国", "esp" : "西班牙", "sui" : "瑞士", "usa" : "美国", "uru" : "乌拉圭" }, 
	"french" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "États-Unis", "uru" : "URU" }, 
	"hausa" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"indonesian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "AS", "uru" : "URU" }, 
	"kinyarwanda" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"macedonian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"ndebele" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"oromoo" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"portuguese" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "EUA", "uru" : "URU" }, 
	"russian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "США", "uru" : "URU" }, 
	"spanish" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"serbian" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"shona" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"somali" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"swahili" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"tigrigna" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"turkish" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "USA", "uru" : "URU" }, 
	"ukrainian" : {"alg" : "АЛЖ", "arg" : "АРГ", "aus" : "АВС", "bel" : "БЕЛ", "bih" : "БОС", "bra" : "БРА", "cmr" : "КМР", "chi" : "ЧИЛ", "col" : "КЛМ", "crc" : "КРК", "cro" : "ХРВ", "civ" : "КДІ", "ecu" : "ЕКВ", "eng" : "АНГ", "fra" : "ФРА", "ger" : "НІМ", "gha" : "ГАН", "gre" : "ГРЕ", "hon" : "ГОН", "irn" : "ІРН", "ita" : "ІТЛ", "jpn" : "ЯПН", "mex" : "МЕХ", "ned" : "НІД", "nga" : "НІГ", "por" : "ПОР", "rus" : "РОС", "kor" : "КОР", "esp" : "ІСП", "sui" : "ШВЦ", "usa" : "США", "uru" : "УРУ" }, 
	"uzbek" : {"alg" : "JAZ", "arg" : "ARG", "aus" : "AVS", "bel" : "BLG", "bih" : "BOS", "bra" : "BRA", "cmr" : "KMR", "chi" : "CHI", "col" : "KOL", "crc" : "KOS", "cro" : "XOR", "civ" : "FIL S", "ecu" : "EKV", "eng" : "ANG", "fra" : "FRA", "ger" : "GER", "gha" : "GAN", "gre" : "GRE", "hon" : "GON", "irn" : "ERN", "ita" : "ITA", "jpn" : "YPN", "mex" : "MEK", "ned" : "GOL", "nga" : "NGR", "por" : "POR", "rus" : "ROS", "kor" : "KOR", "esp" : "ISP", "sui" : "SHV", "usa" : "AQSh", "uru" : "URG" }, 
	"vietnamese" : {"alg" : "ALG", "arg" : "ARG", "aus" : "AUS", "bel" : "BEL", "bih" : "BIH", "bra" : "BRA", "cmr" : "CMR", "chi" : "CHI", "col" : "COL", "crc" : "CRC", "cro" : "CRO", "civ" : "CIV", "ecu" : "ECU", "eng" : "ENG", "fra" : "FRA", "ger" : "GER", "gha" : "GHA", "gre" : "GRE", "hon" : "HON", "irn" : "IRN", "ita" : "ITA", "jpn" : "JPN", "mex" : "MEX", "ned" : "NED", "nga" : "NGA", "por" : "POR", "rus" : "RUS", "kor" : "KOR", "esp" : "ESP", "sui" : "SUI", "usa" : "Mỹ", "uru" : "URU" } 
}


	//If language isn't included in the dictionary, default to English.
	if (typeof dictionary[translationLanguage] === 'undefined') {
		language='english'
	}else{
		language=translationLanguage;
	};
	

	//Set the default game time total (but allow for overtime)
	var gameTimeTotal = 90;
	if (game.matchTime>90){
		gameTimeTotal = game.matchTime
	}
	logger('------');
	logger(game);
	logger('------');

	//Add the chart creation information to the chartArray for resizing-----------------------------------------------
	var timelineInfo = {'game':game
		, 'targetDiv': targetDiv
		, 'paddingSides': paddingSides
		, 'language': translationLanguage};
	var timeLabelsArray=[];


	var check = false; //Check if the current chart has already been pushed to the array?

	for (var i = 0; i < timelineArray.length; i++){                       
		if (targetDiv === timelineArray[i].targetDiv){
		  check = true;
		}
	}

	if (!check){
		timelineArray.push(timelineInfo);
	}


	if(!addResizeForTimeline){
		window.addEventListener('resize', function(event) { rebuildTimeline() } );
		addResizeForTimeline = true;
	}

	/* Decide which team's goals are green and which are gray */
	function countProperties(obj) {
		var count = 0;
		for(var prop in obj) {
			logger('obj.time');
			logger(obj.time);
			if(obj.time>=1){
				if(obj.hasOwnProperty(prop)){++count};
			};
		};
		return count;
	}

	var homeGoalNumbers = countProperties(game.home.goal);
	var awayGoalNumbers = countProperties(game.away.goal);
	var homeColor = '#999';//#ff6d28 :: orange?
	var awayColor = '#999';

	//Add an option for draws?
	if (homeGoalNumbers>= awayGoalNumbers){
		logger("more home goals");
		homeColor = '#339933';
	}else{
		logger("more away goals");
		awayColor = '#339933';
	}
	//Save the current gameData for resizing
	gameDataHolder = game;

	//If option for padding on the sides isn't set, set it to a default value of 20;
	if (paddingSides){
		paddingSidesHolder = paddingSides;
	}else{
		paddingSides = typeof paddingSides !== 'undefined' ? paddingSides : 20;
		paddingSidesHolder = paddingSides;
	}
	logger('line 75: ' + targetDiv)

	var paddingLeft = paddingSides; //20;
	var paddingRight = paddingLeft; //20;
	logger(d3.select(targetDiv));
	logger('-----')
	var width = parseInt( d3.select(targetDiv).style('width') ) ;
	var height = parseInt( d3.select(targetDiv).style('height') );

	var svgName=targetDiv+'svg';
	svgName=svgName.replace("#", "");
	svgName=svgName.replace(".", "");
	svgID='#'+svgName;

	var  timelineBar = d3.select(targetDiv)
		.append('svg')
		.attr("id", svgName)
		.attr('width', width );


	//Add the team abbreviations on the left
	var homeTabbr = game.home.abbreviation.toLowerCase();
	var awayTabbr = game.away.abbreviation.toLowerCase();

	d3.select(svgID)
		.append('text')
		//.text(game.home.abbreviation)
		.text(countries[language][homeTabbr])
		.classed('teamAbbreviation', true)
		.style('fill', homeColor)
		.style('font-weight', 'bold')
		.style('font-size', height / 4)
		.attr('y', height / 3)
		.attr('x', paddingLeft);

	d3.select(svgID)
		.append('text')
		//.text(game.away.abbreviation)
		.text(countries[language][awayTabbr])
		.classed('teamAbbreviation', true)
		.style('fill', awayColor)
		.style('font-weight', 'bold')
		.style('font-size', height / 4)
		.attr('y', height - height / 5)
		.attr('x', paddingLeft);



	// sets the padding on the left to start the timeline (after the abbreviations.)
    d3.select('.teamAbbreviation')
      .each(function () {
        paddingLeftTemp = d3.select(this)
        	.style("width")
        	.replace("px", "");
        logger('paddingLeft: ' + paddingLeftTemp);
        if (paddingLeftTemp == 'auto'){
        	logger('auto width set. Are you using Firefox?');
        	paddingLeft = 60 + paddingLeft;
        }else{
			paddingLeft = Number(paddingLeftTemp) + paddingLeft + 20; 
    	}
        logger('paddingLeft (paddingLeft + width of the abbr. + 20): ' + paddingLeft);
      });


    //Set variables based on width----------------------------------------
	if ( width > 600 ){
		logger('screen size is larger than 600px wide')
		timeLabelsArray = ["0", "15", "30", "45", "60", "75", "90"];
		radius = 14;
		bookingHeight = 20;
		tickSize = 22;
		shootoutRadius = 7;
	} else {
		timeLabelsArray = ["0", "", "", "45", "", "", "90"];
		radius = 10;
		bookingHeight = 25;
		tickSize = 15;
		shootoutRadius = 5;
	};

	//ADD SHOOTOUT ----------------------------------------------------------------------
	var shootout = false;
	if (game.home.shootout[0]){
		shootout = true;
		paddingRight = paddingRight + (2*shootoutRadius)*(game.home.shootout.length+2) + shootoutRadius*3;
	}



	//----------------------------------------------------------------------
	//This scale is used for the current time bar
	var xScale = d3.scale.linear()
		.domain([0, gameTimeTotal ] )
		.range([0, width - paddingLeft - paddingRight] );

	//This is used for the placement of goals and bookings.
	var timeScale = d3.scale.linear()
		.domain([0, gameTimeTotal ] )
		.range([paddingLeft, width - paddingRight] );


	//Create the gray bar for the timeline
	d3.select(svgID)
		.append('rect')
		.attr('x', paddingLeft)
		.attr('y', 30)
		.attr('height', 10)
		.attr('width', width - paddingRight - paddingLeft)
		.attr('fill','#CCC');


	//Create the black bar for the current time
	var currentTime = game.matchTime;
	logger('currentTime: '+currentTime);

	d3.select(svgID)
		.append('rect')
		.attr('x', paddingLeft)
		.attr('y', 30)
		.attr('height', 10)
		.attr('width', xScale(currentTime))
		.attr('fill','#000');

	var radius, bookingHeight, tickSize;



	var xAxis = d3.svg.axis()
		.scale(timeScale)
		.orient('bottom');

	xAxis.tickValues( [0, 15, 30, 45, 60, 75, 90] );
	xAxis.tickSize( [tickSize] );
	xAxis.tickFormat(function (d, i) {return timeLabelsArray[i] } );

	d3.select(svgID)
		.append('g')
		.attr('class', 'axis')
		.attr('transform','translate(0, 30)')
		.call(xAxis);

	//ADD SHOOTOUTS-----------------------------
	var shootoutLabel = false; 
	function addShootout(team, yVariable, teamColor){
		var className = 'shootout'+team;
		var classNameClass = "."+className;

		d3.select(svgID)
			.append('g')
			.classed(className, true)
			.attr('transform', function (d){return 'translate(' + ( width - paddingRight +shootoutRadius*3) +', ' + yVariable + ')'});

		var shootout_score = d3.select(classNameClass);

		if(!shootoutLabel){
			shootout_score.append('text')
			.text(function (d,i){return dictionary[language].shootout})
			.classed('teamAbbreviation', true)
			.style('fill', '#000')
			.style('font-weight', 'bold')
			.style('font-size', height / 5)
			.attr('y', -12)
			.attr('x', -shootoutRadius);

			shootoutLabel = true;
		}	


		shootout_score.selectAll('circle')
			.data(game[team].shootout)
			.enter()
			.append('circle')
			.classed('shot', true)
			.attr('r', shootoutRadius)
			.attr('cy',0)
			.attr('cx', function (d,i){ return (i*shootoutRadius*2) + (5*i); } )
			.attr('fill', function (d,i){var color = '#FFF'; if (d.result == 'Scored'){color = teamColor}; return color } )
			.attr('stroke', '#000') 
			.attr('stroke-width', 2)
			.on("mousedown", clickedShootout);

		function clickedShootout(d, i){
			alert(d.playerFirstName + " " + d.playerLastName + " "+ dictionary[language][d.result.toLowerCase()]+'.');
			//alert(dictionary[language][d.card.toLowerCase()+'Card'] + ": " + d.playerFirstName + " " + d.playerLastName + " ( "+ d.time +"' )");
		};
	}



	//BOOKINGS--------------------------------------------------------------------
	function addBookings(team, yVariable){
		var bookingClass = 'booking' + team;

		d3.select(svgID).append('g').classed(bookingClass, true);
		bookingClass = '.' + bookingClass;

		var bookings=d3.select(svgID);

		var xPosition;

		bookings.select(bookingClass)
			.selectAll('g')
			.data(game[team].booking)
			.enter()
			.append('g')
			.append('rect')
			.classed('booking', true)
			.attr('y', bookingHeight + yVariable )
			.attr('x', function(d){return timeScale( d.time ) - radius } )
			.attr('width', radius * 2)
			.attr('height', radius * 2)
			.attr('fill', function (d, i){var color; if (d.card == 'Red'){color = "#900"}else {color = "#ffde17"}; return color } )
			.attr('stroke', '#FFF')
			.on("mousedown", clickedBookings);

		bookings.select(bookingClass)
			.selectAll('g')
			.append('text')
			.text("!")
			.attr('text-anchor','middle')
			.classed('goalNumber', true)
			.attr('x', function(d){return timeScale( d.time )  } )
			.attr('y', 40 + yVariable)
			.style('fill', function (d, i){var color; if (d.card == 'Red'){ color='#FFF' } else {color='#000'}; return color } );
	};
	function clickedBookings(d, i){
		//alert(d.playerLastName +" received a "+ d.card +" card at minute "+ d.time);
		alert(dictionary[language][d.card.toLowerCase()+'Card'] + ": " + d.playerFirstName + " " + d.playerLastName + " ( "+ d.time +"' )");
	};


	//SUBSTITUTIONS--------------------------------------------------------------------
	function addSubstituions(teamSubstitution, team, yVariable){
		var substitutions = d3.select(svgID);
		var triangleHeight = radius * 2;
		var trianglePath = 'M-' + radius + ',0 L' + radius +',0 L0,' + triangleHeight + ' Z';
		if (team=='away'){
			//trianglePath = 'M-' + radius + ',0 L' + radius +',0 L0,' + triangleHeight + ' Z';
			trianglePath = 'M0,' + yVariable + ' L' + radius +',' + (yVariable + triangleHeight)+' L-' + radius +',' + (yVariable + triangleHeight) + ' Z';
		}

		substitutions.append('g').classed(teamSubstitution, true);
		var selection = "." + teamSubstitution;

		substitutions.select(selection)
			.selectAll('g')
			.data(game[team].substitution)
			.enter()
			.append('g')
			.append('path')
			//.attr('d', 'M-8,0 L8,0 L0,30 Z')
			.attr('d', trianglePath)
			.classed('substitution', true)
			.attr('transform', function (d){return 'translate(' + (timeScale(d.time) ) +', ' +  yVariable + ')'})
			.attr('y',35 + yVariable)
			.attr('fill', '#ff6d28')
			.attr('stroke', '#FFF')
			.on("mousedown", clickedSubstitution);
	};
	function clickedSubstitution(d, i){
		alert(dictionary[language].substitution + " ( '" + d.time + "' )\n" + dictionary[language].out +": " + d.offFirstName + " " + d.offLastName + "\n" + dictionary[language].in +": " + d.onFirstName + " " + d.onLastName);
	}


	//GOALS--------------------------------------------------------------------
	function addGoals(teamGoals, team, color, yVariable){
		var goals=d3.select(svgID)

		goals.append('g').classed(teamGoals, true);
		var selection = "." + teamGoals;

		goals.select(selection)
			.selectAll('g')
			.data(game[team].goal)
			.enter()
			.append('g')
			.append('circle')
			.classed('goal', true)
			.attr('r', radius)
			.attr('cy',35 + yVariable)
			.attr('cx', function(d){if(d.time>=0){xPosition = timeScale( d.time ) }else{ xPosition = 10000 }; logger('xPosition: '+xPosition+" "+ d.time); return xPosition } )
			//.attr('cx',function(d){return timeScale( d.time ) } )
			.attr('fill', color)
			.attr('stroke', function (d){
				if (d.type=="Own") { 
					if (team == 'home'){return '#666'}else{return homeColor}
				}
			} ) 
			.attr('stroke-width', function (d){if (d.type=="Own") { return 2 } } ) 
			.on("mousedown", clickedGoals);

		var selectionG=selection + " g";
		var teamGoals2=goals.selectAll(selectionG);

		teamGoals2.append('text')
			.text(function (d, i){return i + 1 } )
			.attr('text-anchor', 'middle')
			.classed('goalNumber', true)
			//.attr('x', function(d){return timeScale( d.time ) } )
			.attr('x', function(d){if(d.time>=1){xPosition = timeScale( d.time ) }else{ xPosition = 10000 }; logger('xPosition: '+xPosition+" "+ d.time); return xPosition } )
			.attr('y', 40 + yVariable);
	};

	function clickedGoals(d, i){
		//logger("This goal was scored by " + d.playerFirstName + " " + d.playerLastName + " at minute " + d.time);
		//alert("This goal was scored by " + d.playerFirstName + " " + d.playerLastName + " at minute " + d.time);
		if (d.type=='Own'){
			alert(dictionary[language].ownGoal + ": " + d.playerFirstName + " " + d.playerLastName + " ( "+ d.time +"' )");			
		}else{
			alert(dictionary[language].goal + ": " + d.playerFirstName + " " + d.playerLastName + " ( "+ d.time +"' )");
		}
	}

	addSubstituions('homeSubstitutions', 'home',0);
	addSubstituions('awaySubstitutions', 'away',20);

	addBookings('home', -20);
	addBookings('away', 20);

	addGoals('homeGoals', 'home', homeColor, -20);
	addGoals('awayGoals', 'away', awayColor, 20);

	if (shootout){
		addShootout('home', 25, '#393');
		addShootout('away', 45, '#999');
	}	
};

function rebuildTimeline(){
  waitForFinalEventTimeline(function(){
    for (i=0;i<timelineArray.length;i++){
		var oldSVG=timelineArray[i].targetDiv+'svg';

		oldSVG=oldSVG.replace("#", "");
		oldSVG=oldSVG.replace(".", "");
		oldSVG='#'+oldSVG;

		d3.select(oldSVG).remove();//Loop through and destroy the [i] chart (just the SVG)

		var game = timelineArray[i].game
			, targetDiv = timelineArray[i].targetDiv
			, paddingSides = timelineArray[i].paddingSides
			, language = timelineArray[i].language;

      buildTimeline(game, targetDiv, paddingSides, language);
    }
  }, 500, "some unique string");
}

var waitForFinalEventTimeline = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		};
		if (timers[uniqueId]) {
			clearTimeout (timers[uniqueId]);
		}timers[uniqueId] = setTimeout(callback, ms);
	};
})();
