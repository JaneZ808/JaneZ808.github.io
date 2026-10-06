/* ============================================================
 *  张靓颖 Jane Zhang · 资料站 — 数据层
 *  资料来源：百度百科 / 搜狗百科 / QQ音乐百科 / 维基百科音乐作品列表
 *  所有条目均以公开可查证的百科词条为依据，未作虚构。
 * ============================================================ */

/* ---------- 1. 基本档案 ---------- */
const PROFILE = {
  name: '张靓颖',
  enName: 'Jane Zhang',
  title: '中国内地流行乐女歌手 / 词曲作者 / 音乐制作人',
  slogan: '终于等到你，还好我没放弃',
  intro:
    '张靓颖（Jane Zhang），1984年10月11日出生于四川省成都市，毕业于四川大学外国语学院，中国内地流行乐女歌手、词曲作者、音乐制作人，现任中华全国青年联合会委员。2005年参加湖南卫视选秀节目《2005超级女声》获得全国季军，凭标志性"海豚音"与深情演绎正式出道。她是首位获得香港电影金像奖"最佳原创电影歌曲"的内地歌手，也是首位亮相格莱美颁奖典礼、并三度登上格莱美红毯的华人歌手。',
  facts: [
    { k: '中文名', v: '张靓颖' },
    { k: '外文名', v: 'Jane Zhang' },
    { k: '别　名', v: '井姐、女神、张珍女士' },
    { k: '粉丝名', v: '凉粉（"靓粉"谐音）' },
    { k: '国　籍', v: '中国（汉族）' },
    { k: '出生地', v: '四川省成都市' },
    { k: '出生日期', v: '1984年10月11日（农历九月十七）' },
    { k: '星　座', v: '天秤座' },
    { k: '血　型', v: 'O型' },
    { k: '毕业院校', v: '四川大学外国语学院' },
    { k: '职　业', v: '歌手、词曲作者、音乐制作人' },
    { k: '出道时间', v: '2005年（《2005超级女声》全国季军）' },
    { k: '音乐风格', v: '流行、R&B、爵士、灵魂乐' },
    { k: '经纪公司', v: '上海靡之音乐有限公司' }
  ],
  stats: [
    { n: '21', u: '年', l: '出道至今（2005—2026）' },
    { n: '7', u: '张', l: '录音室专辑' },
    { n: '9', u: '届', l: '华人歌曲音乐盛典最佳女歌手' },
    { n: '100M+', u: '', l: '《画心》数字音乐下载量' }
  ]
};

/* ---------- 2. 音乐专辑 ---------- */
/* type: studio 录音室专辑 / ep 迷你专辑 / live 现场专辑 / best 精选辑 */
const ALBUMS = [
  {
    name: 'Past Progressive',
    cn: '首张全英文专辑',
    date: '2019.04.27',
    type: 'studio',
    label: '哆咪哆音乐',
    songs: 16,
    desc: '全球同步发行的全英文专辑，由汀巴兰德（Timbaland）、King Logan、Harvey Mason Jr. 等担任制作人。收录《Dust My Shoulders Off》《808》《Work For It》等作品。',
    tags: ['全英文', '国际制作'],
    award: '第27届东方风云榜最佳英文专辑奖（2020）'
  },
  {
    name: '第七感',
    cn: '第六张录音室专辑',
    date: '2014.07.21',
    type: 'studio',
    label: '索尼音乐 / 少城时代',
    songs: 12,
    desc: '收录《我是我的》《微笑以后》《永远》《BAZAAR》等12首作品，其中5首由张靓颖参与创作。由阿弟仔、方大同、李振权担任制作人。',
    tags: ['时尚概念', '参与创作'],
    award: '第3届音悦V榜年度盛典年度最佳专辑奖（2015）'
  },
  {
    name: '改变',
    cn: '第五张录音室专辑',
    date: '2011.06.01',
    type: 'studio',
    label: '环球唱片 / 少城时代',
    songs: 11,
    desc: '内地实体专辑上市首月销量超过20万张，获国际唱片业协会（IFPI）认证"双倍白金唱片"销量。凭此专辑第六次蝉联北京流行音乐典礼年度最佳女歌手。',
    tags: ['双白金认证'],
    award: '2011年度北京流行音乐典礼年度最佳女歌手'
  },
  {
    name: '我相信',
    cn: '第四张录音室专辑',
    date: '2010.02.02',
    type: 'studio',
    label: '环球唱片 / 少城时代',
    songs: 10,
    desc: '以"百变天后"定位推出，国际版发行首周登上台湾G-Music排行榜前三名。主打歌《如果这就是爱情》以9552万次搜索量获百度娱乐沸点年度最热门内地十大金曲第一名。',
    tags: ['销量冠军', '亚洲发行'],
    award: '2010年度北京流行音乐典礼年度最佳女歌手'
  },
  {
    name: '张靓颖@音乐',
    cn: '第三张录音室专辑',
    date: '2009.01.16',
    type: 'studio',
    label: '华谊兄弟',
    songs: 10,
    desc: '收录《那不会是爱吧》《为难》《黑夜里的光》等10首歌曲，实体专辑首发数量达10万张，获"FAB华语唱片销量年榜"年度销量第三名。',
    tags: ['四次蝉联'],
    award: '2009年度北京流行音乐典礼年度最佳女歌手'
  },
  {
    name: 'UPDATE*JANE',
    cn: '第二张录音室专辑',
    date: '2007.08',
    type: 'studio',
    label: '华谊兄弟',
    songs: 10,
    desc: '收录《我们说好的》《G大调的悲伤》《Dream Party》等10首歌曲。由她谱曲的《我们在一起》被联合国儿童基金会选为高校志愿者项目主题曲。',
    tags: ['原创作曲'],
    award: '蝉联北京流行音乐典礼年度最佳女歌手'
  },
  {
    name: 'The One',
    cn: '首张录音室专辑',
    date: '2006.10.11',
    type: 'studio',
    label: '华谊兄弟',
    songs: 10,
    desc: '收录《如果爱下去》《想你，零点零一分》《这该死的爱》等10首歌曲，开创"靓式情歌"歌路。实体专辑上市三个月销量突破十倍白金。',
    tags: ['十倍白金', '出道首专'],
    award: '第6届中国金唱片奖通俗类演员奖'
  },
  {
    name: 'Do What Makes You Feel Alive',
    cn: '英文迷你专辑',
    date: '2025.10.11',
    type: 'ep',
    label: '靡之音乐',
    songs: 2,
    desc: '生日当天推出的英文EP，收录《Do What Makes You Feel Alive》《Down With You》两首流行风格曲目，传递挣脱生活压力、跟随内心感受生活的态度。',
    tags: ['英文EP'],
    award: '腾讯音乐浪潮榜2025年10月榜第7位；2026.10 推出 CD / 黑胶实体版'
  },
  {
    name: '感谢',
    cn: '公益迷你专辑',
    date: '2013',
    type: 'ep',
    label: '少城时代',
    songs: 5,
    desc: '为长江江豚特别录制的公益EP，收录《感谢》《亿声祝福》《滚动》等5首歌曲，其中3首由张靓颖亲自制作。她捐出80万元EP版税用于长江江豚保护。',
    tags: ['公益', '江豚保护'],
    award: '提名MTV欧洲音乐奖中国大陆及香港地区最佳艺人'
  },
  {
    name: 'Dear Jane',
    cn: '第二张迷你专辑',
    date: '2007.12.08',
    type: 'ep',
    label: '华谊兄弟',
    songs: 3,
    desc: '收录《Dear Jane》《我走以后》《围城》3首歌曲，与"我们说好的演唱会"同日推出。',
    tags: ['同名EP'],
    award: ''
  },
  {
    name: 'Jane·爱',
    cn: '首张迷你专辑',
    date: '2006.01.12',
    type: 'ep',
    label: '华谊兄弟',
    songs: 3,
    desc: '出道后首张EP，收录《光芒》《To Be Loved》《逆时针》3首歌曲。实体版上市3天突破20万张、两个月突破50万张；数字版上线3天付费下载20万次。',
    tags: ['出道首作'],
    award: ''
  },
  {
    name: '领衔主演2',
    cn: '影视金曲精选辑',
    date: '2018.03.08',
    type: 'best',
    label: '少城时代',
    songs: 10,
    desc: '收录《Fighting Shadows》（电影《终结者：创世纪》）、《十里桃花》（电影《三生三世十里桃花》）、《玲珑》（电视剧《醉玲珑》）、《思美人》等影视金曲。',
    tags: ['OST精选'],
    award: ''
  },
  {
    name: '领衔主演',
    cn: '影视金曲精选辑',
    date: '2016.12.30',
    type: 'best',
    label: '索尼音乐 / 少城时代',
    songs: 12,
    desc: '收录《终于等到你》（电视剧《咱们结婚吧》）、《无字碑》（电视剧《武媚娘传奇》）、《木兰星》（电影《花木兰》）、《Be Here》等影视主题曲。',
    tags: ['OST精选'],
    award: ''
  },
  {
    name: '倾听',
    cn: 'ONE TAKE 现场专辑',
    date: '2012.06.08',
    type: 'live',
    label: '环球唱片 / 少城时代',
    songs: 15,
    desc: '以 24bit/96KHz 发烧级标准现场一次录制成型的专辑，收录《好不容易》《I Didn\'t Know》等15首歌曲。实体专辑上市两个月突破7万张销量。',
    tags: ['同期录音', '发烧级'],
    award: '第20届东方风云榜最佳女歌手'
  },
  {
    name: '我爱邓丽君',
    cn: '翻唱致敬专辑',
    date: '2006.08',
    type: 'live',
    label: '华谊兄弟',
    songs: 10,
    desc: '致敬邓丽君的翻唱专辑，上市两周实体销量15万张。张靓颖自幼受父母影响接触邓丽君的歌曲，这也是她音乐启蒙的重要来源。',
    tags: ['致敬经典'],
    award: ''
  },
  {
    name: '张靓颖 2007北京演唱会',
    cn: '现场专辑',
    date: '2008.03.12',
    type: 'live',
    label: '华谊兄弟',
    songs: null,
    desc: '2007 年北京演唱会现场实录，记录其早期"我们说好的"演唱会的舞台表现，为出道后首张正式现场专辑。',
    tags: ['现场实录'],
    award: ''
  },
  {
    name: '张靓颖 我的模样演唱会',
    cn: '现场专辑',
    date: '2012.06.24',
    type: 'live',
    label: '环球唱片 / 少城时代',
    songs: null,
    desc: '"我的模样"世界巡回演唱会现场专辑，收录巡演舞台精选曲目，延续发烧级录音品质。',
    tags: ['巡演实录'],
    award: ''
  },
  {
    name: 'BANG THE WORLD',
    cn: '世界巡演现场专辑',
    date: '2017.03.29',
    type: 'live',
    label: '少城时代',
    songs: null,
    desc: '"BANG THE WORLD"世界巡回演唱会现场专辑，记录多城巡演的高能舞台与全开麦演唱。',
    tags: ['巡演实录'],
    award: ''
  },
  {
    name: '一代芳华——邓丽君',
    cn: '致敬现场专辑',
    date: '2018.10.10',
    type: 'live',
    label: '张靓颖工作室',
    songs: null,
    desc: '邓丽君经典作品致敬现场专辑，延续她自 2006 年《我爱邓丽君》以来对邓丽君音乐的致敬。',
    tags: ['致敬经典'],
    award: ''
  },
  {
    name: '过期食品',
    cn: '华语EP',
    date: '2026.09.20',
    type: 'ep',
    label: '靡之音乐',
    songs: 3,
    desc: '华语EP，收录《我所知道的修辞手法》《加码》《过期食品》三首作品，以戏剧性故事的结局回望情感，传递"坚硬的话，柔软的心"。',
    tags: ['华语EP'],
    award: ''
  }
];

/* ---------- 3. 影视金曲（OST） ---------- */
const OSTS = [
  { song: '野心家', work: '电视剧《灼灼韶华》', year: '2025', note: '唐恬作词、周以力作曲编曲 · 女性觉醒向年度"战歌"，获2026 QQ音乐巅峰榜"年度巅峰影视单曲"、第33届东方风云榜十大金曲' },
  { song: '画心', work: '电影《画皮》', year: '2008', note: '第28届香港电影金像奖最佳原创电影歌曲奖 · 移动数字音乐下载量达1亿次' },
  { song: '我用所有报答爱', work: '电影《夜宴》', year: '2006', note: '冯小刚执导 · 第12届香港电影金紫荆奖最佳电影歌曲奖' },
  { song: '天下无双', work: '电视剧《神雕侠侣》', year: '2006', note: '张纪中版 · 随剧登陆中国大陆及港澳台各大电视台' },
  { song: '终于等到你', work: '电视剧《咱们结婚吧》', year: '2013', note: '"终于等到你，还好我没放弃"成为社会热门流行语' },
  { song: '无字碑', work: '电视剧《武媚娘传奇》', year: '2014', note: '2015华语金曲奖十大华语金曲' },
  { song: '敢为天下先', work: '电视剧《武媚娘传奇》', year: '2014', note: '剧集插曲' },
  { song: 'Fighting Shadows', work: '电影《终结者：创世纪》', year: '2015', note: '好莱坞大片全球主题曲 · 与 Big Sean 合唱' },
  { song: '木兰星', work: '电影《花木兰》', year: '2009', note: '电影插曲' },
  { song: 'Heroes', work: '电影《功夫之王》', year: '2008', note: '成龙、李连杰主演 · 片尾曲' },
  { song: '十里桃花', work: '电影《三生三世十里桃花》', year: '2017', note: '电影主题曲' },
  { song: '玲珑', work: '电视剧《醉玲珑》', year: '2017', note: '电视剧主题曲' },
  { song: '思美人', work: '电视剧《思美人》', year: '2017', note: '第11届音乐盛典咪咕汇年度十大金曲' },
  { song: '顺流而下', work: '电视剧《鬼吹灯之精绝古城》', year: '2016', note: '电视剧主题曲' },
  { song: '一定要幸福', work: '电视剧《咱们相爱吧》', year: '2016', note: '第24届东方风云榜十大金曲' },
  { song: '破晓以后', work: '电影《龙之谷：破晓奇兵》', year: '2014', note: '中文版主题曲' },
  { song: 'Be Here', work: '电影《露水红颜》', year: '2014', note: '电影主题曲' },
  { song: '沉香', work: '电视剧《沉香如屑》', year: '2022', note: '古装仙侠剧主题曲' },
  { song: 'I Love This City', work: '成都城市形象主题曲', year: '2008', note: '汶川地震后推出 · 获四川省委宣传部"五个一工程"奖' },
  { song: 'Writing\'s On The Wall', work: '电影《007：幽灵党》', year: '2015', note: '中国区推广曲 · 翻唱 Sam Smith 原曲，随影片全球发行' },
  { song: 'Battlefield', work: '电影《长城》', year: '2016', note: '全球推广曲 · 未宣传即登上美国 iTunes 即时下载总榜第50位、电影原声带榜第2位' },
  { song: '女儿国', work: '电影《西游记女儿国》', year: '2017', note: '与李荣浩合唱 · 电影主题曲' },
  { song: '红蔷薇', work: '电视剧《红蔷薇》', year: '2017', note: '陈少琪、张靓颖作词 · 电视剧主题曲' },
  { song: '双生焰', work: '电影《神探蒲松龄》', year: '2019', note: '电影主题曲' },
  { song: '蝴蝶飓风', work: '电视剧《怪你过分美丽》', year: '2020', note: '电视剧主题曲' },
  { song: '她', work: '电视剧《了不起的女孩》', year: '2020', note: '电视剧主题曲' },
  { song: '无华', work: '电视剧《有翡》', year: '2020', note: '片尾主题曲 · 与刘宇宁合唱' },
  { song: '最可爱的人', work: '电影《长津湖》', year: '2021', note: '电影宣传主题曲' },
  { song: '无忘', work: '动画《魔道祖师》', year: '2021', note: '完结篇主题曲 / 片尾曲' },
  { song: '约定', work: '网络剧《约定》', year: '2021', note: '网络剧主题曲' },
  { song: '偏星', work: '电视剧《沉香如屑》', year: '2022', note: '电视剧片尾曲' },
  { song: '技能照亮前程', work: '第48届世界技能大赛主题歌', year: '2026', note: '与黄子弘凡合唱 · 致敬技能从业者、鼓励青年走技能成才之路' }
];

/* ---------- 4. 英文单曲 / 国际化作品 ---------- */
const GLOBAL_SONGS = [
  { name: 'Dust My Shoulders Off', year: '2016', work: '与 Timbaland 合作 · 首支全球发行英文单曲', note: '首支全球发行的英文单曲，登上美国 iTunes 即时榜第4名，MV 蝉联 iTunes MV 榜冠军近一个月' },
  { name: '808', year: '2018', work: '与 DJ Jack Novak 合作 · 公告牌热舞/电子榜', note: '累计八周进榜美国公告牌热舞/电子歌曲排行榜，历史最高第23位' },
  { name: 'Fighting Shadows', year: '2015', work: '电影《终结者：创世纪》全球主题曲', note: '电影《终结者：创世纪》全球主题曲，与 Big Sean 合作' },
  { name: 'Green Light', year: '2024', work: '英文单曲', note: '英文单曲，获第6届腾讯音乐娱乐盛典年度十大金曲' },
  { name: 'Work For It', year: '2017', work: '英文专辑《Past Progressive》收录曲目', note: '英文专辑《Past Progressive》收录曲目' },
  { name: '印象西湖雨 / Impression of the West Lake', year: '2010', work: '与喜多郎合作 · 提名格莱美', note: '与喜多郎合作，收录专辑提名第52届格莱美最佳新世纪音乐专辑奖' },
  { name: 'Change Your World', year: '2015', work: '与 Tiësto 合作 · 风暴电音节主题曲', note: '与荷兰 DJ Tiësto 合作 · 风暴电音节主题曲' },
  { name: 'Dream It Possible', year: '2015', work: '面向国际市场的英文单曲', note: '单曲，面向国际市场的英文作品' },
  { name: 'Battlefield', year: '2016', work: '电影《长城》全球推广曲', note: '电影《长城》全球推广曲 · 登上美国 iTunes 即时下载总榜第50位、电影原声带榜第2位' },
  { name: 'Dust My Shoulders Off (Steve Aoki Remix)', year: '2018', work: '与 Steve Aoki 的混音版', note: '与 DJ Steve Aoki 的混音版 · 收录于《Billboard Presents Electric Asia Vol.1》' },
  { name: 'Make It Big', year: '2016', work: '面向国际市场的英文单曲', note: '面向国际市场的英文单曲' },
  { name: 'Mmm', year: '2026', work: '英文单曲', note: '2026.09.26 发行的英文单曲，延续走向国际的英文路线' }
];

/* ---------- 5. 星路历程（时间线） ---------- */
const TIMELINE = [
  { year: '1984', date: '10.11', title: '出生于四川成都', desc: '受父母影响自幼接触邓丽君的歌曲，少年时期进入少年宫学习唱歌与乐器。' },
  { year: '2002', date: '', title: '担任乐队主唱', desc: '开始担任辕辙乐队主唱，在成都各酒吧演出；同年与交响乐团合作演出。' },
  { year: '2003', date: '', title: '入读四川大学外国语学院', desc: '以自考生身份进入四川大学外国语学院进修，同时在成都音乐房子酒吧驻唱。' },
  { year: '2004', date: '07.25', title: '大学生歌手选拔赛全国总冠军', desc: '参加华纳唱片《闪亮之星大学生歌手选拔赛》获全国总冠军，同年再获全国PUB歌手大胜战总冠军。' },
  { year: '2005', date: '08.26', title: '超级女声全国季军，正式出道', desc: '参加湖南卫视《2005超级女声》获全国总决赛季军，标志性"海豚音"广受关注。同年获雅虎"搜索最热门年度歌手"。' },
  { year: '2006', date: '10.11', title: '首张专辑《The One》', desc: '首张录音室专辑发行，开创"靓式情歌"；同年演唱《夜宴》片尾曲《我用所有报答爱》、《神雕侠侣》主题曲《天下无双》。' },
  { year: '2007', date: '03.31', title: '首场海外售票演唱会', desc: '在美国洛杉矶帕萨迪纳大剧院举行个人演唱会，成为继崔健后第二位在美国举行演唱会的中国内地歌手，获洛杉矶郡政府欢迎奖状。' },
  { year: '2008', date: '10月', title: '《画心》全网传唱', desc: '为电影《画皮》演唱主题曲《画心》，移动数字音乐领域下载量达1亿次。' },
  { year: '2009', date: '05.10', title: '登上《奥普拉脱口秀》', desc: '作为亚洲选秀艺人代表受邀参加美国CBS《奥普拉脱口秀》，演唱《印象西湖雨》，接受奥普拉与西蒙·考威尔访问。同年自立门户成立"少城时代"，签约环球唱片。' },
  { year: '2010', date: '02.01', title: '首位亮相格莱美的华人歌手', desc: '因参与喜多郎专辑《印象·西湖》提名第52届格莱美最佳新世纪专辑奖，出席格莱美官方红毯。同年获第28届亚洲最杰出艺人奖，演唱世博会主题曲《阿拉侬》与世界杯主题曲《旗开得胜》。' },
  { year: '2011', date: '11月', title: 'MAMA 亚洲最佳歌手', desc: '获得韩国 Mnet 亚洲音乐大奖（MAMA）亚洲最佳歌手奖；专辑《改变》获IFPI"双倍白金唱片"销量认证。' },
  { year: '2012', date: '06.08', title: '现场专辑《倾听》', desc: '以 24bit/96KHz 发烧级标准现场一次录制成型，第七次蝉联北京流行音乐典礼最佳女歌手。' },
  { year: '2013', date: '02月', title: '首次登上央视春晚', desc: '与杨坤合唱《一辈子朋友》，成为首位登上央视春晚的选秀出身内地歌手。同年演唱《咱们结婚吧》主题曲《终于等到你》。' },
  { year: '2014', date: '07.21', title: '专辑《第七感》', desc: '签约索尼音乐并推出专辑《第七感》，同年担任第38届蒙特利尔国际电影节评委。' },
  { year: '2015', date: '07月', title: '献声好莱坞大片', desc: '与美国说唱歌手 Big Sean 合唱《终结者：创世纪》全球主题曲《Fighting Shadows》；同年作为首发歌手参加《我是歌手第三季》。' },
  { year: '2016', date: '10月', title: '英文单曲闯入美国 iTunes', desc: '全球发行首支英文单曲《Dust My Shoulders Off》，登上美国 iTunes 即时榜第4名。' },
  { year: '2017', date: '11月', title: '首位登上维密秀的亚洲歌手', desc: '受邀担任《2017维多利亚的秘密时尚秀》表演嘉宾，表演曲目登上美国 iTunes 即时榜前十。' },
  { year: '2018', date: '', title: '"珍相"世界巡演', desc: '英文单曲《808》累计八周进榜美国公告牌热舞/电子歌曲榜，最高第23位；"珍相"巡演美国站单场动员人数位居全美第45位。' },
  { year: '2019', date: '04.27', title: '全英文专辑《Past Progressive》', desc: '全球同步发行首张全英文专辑，同年与美国国家旅游局合作推出个人微综艺《爱乐之程》。' },
  { year: '2023', date: '04月', title: '《天赐的声音》第四季', desc: '参加浙江卫视音乐励志节目并演唱本季主题曲《最初的爱》；同年献唱成都大运会主题曲《爱是一样的》。' },
  { year: '2024', date: '', title: '"光"世界巡回演唱会', desc: '推出英文单曲《Green Light》，获第6届腾讯音乐娱乐盛典年度十大金曲；"光"巡演覆盖多座城市。' },
  { year: '2025', date: '10.11', title: '"追"世界巡回演唱会 · 英文EP', desc: '开启"追"世界巡回演唱会，走过深圳、广州、杭州、成都、郑州及马来西亚、新加坡等十余座城市；生日当天发行英文EP《Do What Makes You Feel Alive》。' },
  { year: '2026', date: '08.16', title: 'TMEA 年度女歌手', desc: '2月16日参加2026年中央广播电视总台春节联欢晚会，表演节目《立上游》；8月16日获第七届TMEA腾讯音乐娱乐盛典年度女歌手，作品《野心家》入选年度十大金曲。' }
];

/* ---------- 6. 巡回演唱会 ---------- */
const TOURS = [
  { name: '我的音乐让我说', en: 'My Music Lets Me Say', year: '2008', note: '首次个人主题巡演' },
  { name: '我相信', en: 'I Believe', year: '2010', note: '覆盖中国四座城市，日本音乐家喜多郎到场观看' },
  { name: '我的模样', en: 'My Appearance', year: '2011—2012', note: '历时两年共8场，登陆新加坡与美国康州' },
  { name: 'BANG THE WORLD', en: 'Bang The World', year: '2015', note: '世界巡回演唱会，后推出巡演纪录片《光芒背后》' },
  { name: '珍相', en: "Jane's Secret", year: '2018', note: '美国站单场动员人数位居全美第45位' },
  { name: '光', en: 'Light', year: '2023—2024', note: '自北京起步的大型世界巡回演唱会，覆盖国内多座城市' },
  { name: '追', en: 'Chase', year: '2025—2026', note: '已走过深圳、广州、杭州、成都、郑州、上海、新加坡等十余座城市；海外巡演以 2026.08.29 新加坡站收官，2026.09.26 南京站、2026.10.10 澳门站为内地及收官场次' }
];

/* ---------- 7. 荣誉墙 ---------- */
/* cat: vocal 最佳女歌手 / song 金曲 / global 国际 / film 影视音乐 / honor 综合 */
const AWARDS = [
  { year: '2026', name: '第七届TMEA腾讯音乐娱乐盛典 · 年度女歌手', cat: 'vocal' },
  { year: '2026', name: '第七届TMEA腾讯音乐娱乐盛典 · 年度十大金曲《野心家》', cat: 'song' },
  { year: '2025', name: '第六届TMEA腾讯音乐娱乐盛典 · 年度最受欢迎歌手、年度最具影响力内地女歌手', cat: 'vocal' },
  { year: '2025', name: '第六届TMEA腾讯音乐娱乐盛典 · 年度十大金曲《Green Light》', cat: 'song' },
  { year: '2020', name: '第27届东方风云榜 · 亚洲最具影响力女歌手、最佳英文专辑《Past Progressive》', cat: 'vocal' },
  { year: '2019', name: '第一届腾讯音乐娱乐盛典 · 年度内地最佳女歌手', cat: 'vocal' },
  { year: '2017', name: '第40届十大中文金曲 · 全国最佳女歌手', cat: 'vocal' },
  { year: '2017', name: '第21届全球华语榜中榜 · 内地最佳女歌手、亚洲影响力最受欢迎女歌手', cat: 'vocal' },
  { year: '2015', name: '第3届音悦V榜年度盛典 · 内地最佳女歌手、最佳专辑《第七感》', cat: 'vocal' },
  { year: '2015', name: '2015QQ音乐年度盛典 · 年度最佳内地女歌手、年度最佳突破艺人', cat: 'vocal' },
  { year: '2013', name: '第13届音乐风云榜 · 最佳女歌手、内地最受欢迎女歌手', cat: 'vocal' },
  { year: '2012', name: '第35届十大中文金曲 · 全国最佳女歌手', cat: 'vocal' },
  { year: '2012', name: '第20届东方风云榜 · 内地最佳女歌手、二十年风云成就大奖', cat: 'vocal' },
  { year: '2011', name: '2011 Mnet 亚洲音乐大奖（MAMA）· 亚洲最佳歌手', cat: 'global' },
  { year: '2011', name: '专辑《改变》获国际唱片业协会（IFPI）"双倍白金唱片"销量认证', cat: 'global' },
  { year: '2010', name: '第28届亚洲最杰出艺人奖（美国纽约市文化局及林肯艺术中心国际艺术交流会）', cat: 'global' },
  { year: '2010', name: '首位亮相格莱美颁奖典礼的华人歌手（第52届）', cat: 'global' },
  { year: '2009', name: '第28届香港电影金像奖 · 最佳原创电影歌曲《画心》', cat: 'film' },
  { year: '2007', name: '第12届香港电影金紫荆奖 · 最佳电影歌曲《我用所有报答爱》', cat: 'film' },
  { year: '2006', name: '第6届中国金唱片奖 · 通俗类演员奖', cat: 'film' },
  { year: '—', name: '九届华人歌曲音乐盛典最佳女歌手', cat: 'honor' },
  { year: '—', name: '六届东方风云榜最佳女歌手', cat: 'honor' },
  { year: '—', name: '四届全球华语音乐榜中榜最佳女歌手', cat: 'honor' },
  { year: '—', name: '三届中国原创音乐流行榜最佳女歌手', cat: 'honor' },
  { year: '—', name: '两届十大中文金曲全国最佳女歌手', cat: 'honor' },
  { year: '—', name: 'MTV欧洲音乐奖亚洲最佳艺人（拒领）', cat: 'honor' },
  { year: '—', name: '全球华语歌曲排行榜最佳女歌手 / 新城国语力颁奖礼亚洲最佳女歌手', cat: 'honor' },
  { year: '—', name: '中国金唱片奖最受欢迎女歌手 / 华语音乐传媒大奖最受欢迎女歌手', cat: 'honor' },
  { year: '—', name: '两届音悦V榜年度盛典最佳女歌手 / 两届QQ音乐年度盛典最佳女歌手', cat: 'honor' }
];

/* ---------- 8. 影视与综艺 ---------- */
const SCREENS = [
  { cat: '电影', title: '天堂旅行团', year: '2025', role: '饰 陈岩', note: '导演刘杰，合作吴谨言、魏大勋、彭昱畅' },
  { cat: '电影', title: '春田花花同学会', year: '2006', role: '麦兜人型', note: '导演赵良骏' },
  { cat: '电视剧', title: '72小时邂逅', year: '2013', role: '女主角', note: 'WWF 拯救江豚公益片' },
  { cat: '电视剧', title: '太阳出来喜洋洋', year: '2007', role: '音乐老师', note: '导演蒋丛' },
  { cat: '电视剧', title: '美丽分贝', year: '2006', role: '女主播', note: '导演孙子荣' },
  { cat: '电视剧', title: '2008分之一', year: '2006', role: '音乐老师（女主角）', note: '导演王光利' },
  { cat: '音乐剧', title: '茉莉花', year: '2007', role: '少女茉莉', note: '中国歌舞剧院歌舞剧，北京保利剧院' },
  { cat: '音乐剧', title: '电影之歌', year: '2005', role: '少女苏君', note: '纪念中国电影诞生100周年多媒体音乐剧' },
  { cat: '纪录电影', title: '林佳树：天空之下', year: '2023', role: '主演', note: '音乐纪录电影，日本首映' }
];

const VARIETY = [
  { year: '2025', name: '亚洲新声', role: '新声召集人 · 唯一常驻导师' },
  { year: '2025', name: '天赐的声音 第六季', role: '常驻音乐合伙人' },
  { year: '2025', name: '音乐缘计划 第二季', role: '常驻嘉宾' },
  { year: '2024', name: '音乐缘计划', role: '常驻嘉宾' },
  { year: '2023', name: '天赐的声音 第四季', role: '常驻音乐合伙人 · 演唱主题曲《最初的爱》' },
  { year: '2022', name: '超感星电音', role: '常驻嘉宾' },
  { year: '2021', name: '中国潮音', role: '国潮音乐竞演' },
  { year: '2020', name: '中国新说唱 2020', role: '厂牌主理人' },
  { year: '2018', name: '梦想的声音 第三季', role: '常驻导师（第五期加入）' },
  { year: '2017', name: '梦想的声音 第二季', role: '常驻导师' },
  { year: '2015', name: '我是歌手 第三季', role: '首发歌手' }
];

/* ---------- 9. 最新动态 ---------- */
const NEWS = [
  {
    date: '2026.10.06',
    tag: '新碟',
    title: '英文EP《Do What Makes You Feel Alive》实体专辑开启预售',
    desc: '实体专辑（CD 版 / 黑胶版）于 10.6 中午 12:00 在 JVIBE STORE「珍好喔」开启预售，10.8 中午 12:00 数字版在 QQ 音乐与小红书同步上线，传递「去做让你觉得鲜活的事」的态度。'
  },
  {
    date: '2026.09.26',
    tag: '新歌',
    title: '发行英文单曲《Mmm》',
    desc: '英文单曲《Mmm》发行，洛杉矶风格的制作与词曲，延续她走向国际的英文路线。'
  },
  {
    date: '2026.09.20',
    tag: '新专',
    title: '发行华语EP《过期食品》',
    desc: '由靡之音乐推出华语EP《过期食品》，收录《我所知道的修辞手法》《加码》《过期食品》三首作品，以戏剧性故事的结局回望一段段情感，传递「坚硬的话，柔软的心」。'
  },
  {
    date: '2026.09',
    tag: '合作',
    title: '与黄子弘凡合唱第48届世界技能大赛主题歌',
    desc: '与黄子弘凡合唱第48届世界技能大赛主题歌《技能照亮前程》，致敬技能从业者、鼓励青年走技能成才之路；本届世赛于 9.22–27 在上海举办。'
  },
  {
    date: '2026.08.29',
    tag: '巡演',
    title: '「追」巡演新加坡站收官，南京、澳门场次官宣',
    desc: '「追」世界巡回演唱会新加坡站在滨海湾金沙会展中心金沙大宴会厅落幕，为海外巡演终场。工作室官宣：2026.9.26 南京梦之蓝青奥体育公园体育馆为内地最终场，2026.10.10 澳门银河综艺馆收官。'
  },
  {
    date: '2026.08.16',
    tag: '荣誉',
    title: '第七届TMEA年度女歌手，《野心家》入选年度十大金曲',
    desc: '第七届TMEA腾讯音乐娱乐盛典在澳门落幕，张靓颖斩获"年度女歌手"，歌曲《野心家》同时入选年度十大金曲。当晚她接连献唱《野心家》《办不到》及英文单曲《Green Light》。'
  },
  {
    date: '2026.02.16',
    tag: '春晚',
    title: '参加2026年央视春晚，表演节目《立上游》',
    desc: '登上《2026年中央广播电视总台春节联欢晚会》舞台，表演节目《立上游》。'
  },
  {
    date: '2025',
    tag: '荣誉',
    title: '第六届TMEA双奖加冕，《Green Light》入选年度十大金曲',
    desc: '在第六届TMEA腾讯音乐娱乐盛典中一人包揽"年度最受欢迎歌手"与"年度最具影响力内地女歌手"双项荣誉，英文单曲《Green Light》入选年度十大金曲。'
  },
  {
    date: '2025.07.25',
    tag: 'OST',
    title: '《野心家》发行，成年度"女性战歌"',
    desc: '为电视剧《灼灼韶华》献唱的主题曲《野心家》上线，由唐恬作词、周以力作曲，被视为其近年最出圈的突破之作，引发广泛翻唱与社会共鸣。'
  },
  {
    date: '2025.10.11',
    tag: '新歌',
    title: '生日当天推出英文EP《Do What Makes You Feel Alive》',
    desc: '通过靡之音乐推出英文EP，收录《Do What Makes You Feel Alive》与《Down With You》两首流行曲目，传递挣脱生活压力、跟随内心感受生活的态度。'
  }
];

/* ---------- 10. 数字音乐平台直达 ---------- */
const PLATFORMS = [
  { name: 'QQ音乐', url: 'https://y.qq.com/n/ryqq/search?w=%E5%BC%A0%E9%9D%93%E9%A2%96' },
  { name: '网易云音乐', url: 'https://music.163.com/#/search/m/?s=%E5%BC%A0%E9%9D%93%E9%A2%96' },
  { name: '酷狗音乐', url: 'https://www.kugou.com/yy/?searchKey=%E5%BC%A0%E9%9D%93%E9%A2%96' },
  { name: '微博', url: 'https://weibo.com/zhangliangying' }
];

/* ---------- 11. 图集（光影瞬间） ---------- */
const GALLERY = [
  { title: '「追」世界巡回演唱会', sub: '2025 — 至今', tone: 0, img: 'assets/img/gallery-1.jpg' },
  { title: '「光」世界巡回演唱会', sub: '2023 — 2024', tone: 1, img: 'assets/img/gallery-2.jpg' },
  { title: '珍相 Jane\'s Secret', sub: '2018 世界巡演', tone: 2, img: 'assets/img/gallery-3.jpg' },
  { title: 'TMEA 腾讯音乐娱乐盛典', sub: '2026 年度女歌手', tone: 3, img: 'assets/img/gallery-4.jpg' },
  { title: '央视春晚舞台', sub: '2013 / 2014 / 2026', tone: 4, img: 'assets/img/gallery-5.jpg' },
  { title: 'Past Progressive', sub: '2019 全英文专辑', tone: 5, img: 'assets/img/gallery-6.jpg' },
  { title: '维多利亚的秘密时尚秀', sub: '2017 首位亚洲歌手', tone: 6, img: 'assets/img/gallery-7.jpg' },
  { title: '格莱美红毯', sub: '2010 首位华人歌手', tone: 7, img: 'assets/img/gallery-8.jpg' },
  { title: '影视金曲之夜', sub: 'OST 女王', tone: 8, img: 'assets/img/gallery-9.jpg' }
];

/* ---------- 封面 / 背景映射（本地图片，由抓取脚本生成；缺失时前端回退渐变占位） ---------- */
const COVER_MAP = {
  album: [
    'assets/img/covers/album-0.jpg', 'assets/img/covers/album-1.jpg', 'assets/img/covers/album-2.jpg',
    'assets/img/covers/album-3.jpg', 'assets/img/covers/album-4.jpg', 'assets/img/covers/album-5.jpg',
    'assets/img/covers/album-6.jpg', 'assets/img/covers/album-7.jpg', 'assets/img/covers/album-8.jpg',
    'assets/img/covers/album-9.jpg', 'assets/img/covers/album-10.jpg', 'assets/img/covers/album-11.jpg',
    'assets/img/covers/album-12.jpg', 'assets/img/covers/album-13.jpg', 'assets/img/covers/album-14.jpg',
    'assets/img/covers/album-15.jpg', 'assets/img/covers/album-16.jpg', 'assets/img/covers/album-17.jpg',
    'assets/img/covers/album-18.jpg', ''
  ],
  ost: [
    'assets/img/osts/ost-0.jpg', 'assets/img/osts/ost-1.jpg', 'assets/img/osts/ost-2.jpg',
    'assets/img/osts/ost-3.jpg', 'assets/img/osts/ost-4.jpg', 'assets/img/osts/ost-5.jpg',
    'assets/img/osts/ost-6.jpg', 'assets/img/osts/ost-7.jpg', 'assets/img/osts/ost-8.jpg',
    'assets/img/osts/ost-9.jpg', 'assets/img/osts/ost-10.jpg', 'assets/img/osts/ost-11.jpg',
    'assets/img/osts/ost-12.jpg', 'assets/img/osts/ost-13.jpg', 'assets/img/osts/ost-14.jpg',
    'assets/img/osts/ost-15.jpg', 'assets/img/osts/ost-16.jpg', 'assets/img/osts/ost-17.jpg',
    'assets/img/osts/ost-18.jpg',
    'assets/img/osts/WritingOnTheWall.jpg', 'assets/img/osts/Battlefield.jpg', 'assets/img/osts/女儿国.jpg',
    'assets/img/osts/红蔷薇.jpg', 'assets/img/osts/双生焰.jpg', 'assets/img/osts/蝴蝶飓风.jpg',
    'assets/img/osts/她.jpg', 'assets/img/osts/无华.jpg', 'assets/img/osts/最可爱的人.jpg',
    'assets/img/osts/无忘.jpg', 'assets/img/osts/约定.jpg', 'assets/img/osts/偏星.jpg', ''
  ],
  global: [
    'assets/img/globals/DustMyShouldersOff.jpg', 'assets/img/globals/808.jpg', 'assets/img/globals/FightingShadows.jpg',
    'assets/img/globals/GreenLight.jpg', 'assets/img/globals/WorkForIt.jpg', 'assets/img/globals/印象西湖雨.jpg',
    'assets/img/globals/ChangeYourWorld.jpg', 'assets/img/globals/DreamItPossible.jpg', 'assets/img/osts/Battlefield.jpg',
    'assets/img/globals/DustMyShouldersOffSteveAokiRemix.jpg', 'assets/img/globals/MakeItBig.jpg', ''
  ]
};
/* 星路历程每项对应的背景图：
   优先使用站内已有真实照片（gallery-*.jpg，均为张靓颖真实舞台/奖项影像）中与事件相符者；
   无相符真实照片者留空，前端回退为渐变占位（绝不放置错误图片）。
   注：专辑/OST 真实封面需联网抓取（沙箱当前外网不通），待可联网时填入 assets/img/covers、osts 即可自动生效。 */
const TIMELINE_BG = [
  '', '', '', '', '',
  '',
  'assets/img/gallery-9.jpg',
  '',
  'assets/img/gallery-8.jpg',
  '',
  '',
  'assets/img/gallery-5.jpg',
  '',
  '',
  '',
  '',
  'assets/img/gallery-7.jpg',
  'assets/img/gallery-6.jpg',
  'assets/img/gallery-6.jpg',
  '',
  'assets/img/gallery-2.jpg',
  'assets/img/gallery-1.jpg',
  'assets/img/gallery-4.jpg'
];
/* 统一封面大图：所有事件暂用同一张（gallery-5，2013 央视春晚舞台现场）。
   后续逐事件补真实图时：把 TIMELINE_PER_EVENT 改为 true，
   即按上方 TIMELINE_BG 取各事件图片，未配置者仍回退 TIMELINE_COVER。 */
const TIMELINE_COVER = 'assets/img/gallery-5.jpg';
const TIMELINE_PER_EVENT = false;
if (typeof window !== 'undefined') {
  window.COVER_MAP = COVER_MAP;
  window.TIMELINE_BG = TIMELINE_BG;
  window.TIMELINE_COVER = TIMELINE_COVER;
  window.TIMELINE_PER_EVENT = TIMELINE_PER_EVENT;
}
