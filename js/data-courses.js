/**
 * js/data-courses.js - 场景课程 30 节（内容包）
 * 面向有英语基础者：完整礼貌句型，每节 5-6 句，跟读打分。
 * 数据结构与 CONTENT.courses 兼容，由 data.js 聚合。
 */

const COURSES_DATA = {
  'restaurant-day01': {
    courseId: 'restaurant-day01', scene: 'restaurant', title: '找座位', icon: '餐', day: 1, level: 1,
    duration: '10-15分钟', coreSentence: 'Could we have a table by the window, please?',
    sentences: [
      { order: 1, en: 'Good evening. Do you have a table for two?', cn: '晚上好，有两位的位子吗？', keywords: ['good', 'table', 'two'], tips: '进店先问位子，Good evening 比 Hello 更得体。' },
      { order: 2, en: 'Could we have a table by the window, please?', cn: '能给我们一个靠窗的位子吗？', keywords: ['table', 'window'], tips: 'Could we... 比 I want 更礼貌，出国点餐万能开头。' },
      { order: 3, en: 'How long is the wait? We do not have a reservation.', cn: '要等多久？我们没有预订。', keywords: ['wait', 'reservation'], tips: '生意好的餐厅常要排队，这句能帮你预估时间。' },
      { order: 4, en: 'We would like to sit outside, if that is okay.', cn: '如果可以的话，我们想坐外面。', keywords: ['sit', 'outside'], tips: '「if that is okay」委婉商量，听起来客气不生硬。' },
      { order: 5, en: 'Excuse me, could we move to another table? It is a bit cold here.', cn: '打扰一下，能换张桌子吗？这里有点冷。', keywords: ['move', 'another', 'table'], tips: '入座后想换位子，先说 Excuse me 再提要求。' },
      { order: 6, en: 'It is perfect, thank you so much.', cn: '非常好，太感谢了。', keywords: ['perfect', 'thank'], tips: '对安排满意就大方夸一句，服务生会很高兴。' },
      { order: 7, en: 'Sorry, could you repeat that a little more slowly?', cn: '不好意思，您能说慢一点吗？', keywords: ['repeat', 'slowly'], tips: '听不懂别说 OK，加 a little more slowly 更容易听清。' }
    ]
  },

  'restaurant-day02': {
    courseId: 'restaurant-day02', scene: 'restaurant', title: '点餐推荐', icon: '餐', day: 2, level: 1,
    duration: '10-15分钟', coreSentence: 'What do you recommend?',
    sentences: [
      { order: 1, en: 'Could you recommend something popular here?', cn: '你能推荐这里的招牌菜吗？', keywords: ['recommend', 'popular'], tips: '不知道点什么时，让服务员推荐最省心。' },
      { order: 2, en: 'What is today\'s special?', cn: '今天的特色菜是什么？', keywords: ['special', 'today'], tips: '很多餐厅有当日特价菜，划算又新鲜。' },
      { order: 3, en: 'I\'d like the grilled salmon with vegetables, please.', cn: '请给我烤三文鱼配蔬菜。', keywords: ['grilled', 'salmon', 'vegetables'], tips: 'I\'d like 加菜品名，就是最标准的点餐句。' },
      { order: 4, en: 'What drinks do you have?', cn: '你们有什么饮品？', keywords: ['drinks'], tips: '点完主菜问饮料，一词多用。' },
      { order: 5, en: 'I\'ll have a glass of white wine.', cn: '我要一杯白葡萄酒。', keywords: ['glass', 'wine'], tips: 'a glass of 一杯；a bottle of 一瓶。' },
      { order: 6, en: 'That sounds good. I\'ll take it.', cn: '听起来不错，我就要这个了。', keywords: ['sounds', 'take'], tips: '确认下单的万能句，服务员等这句呢。' }
    ]
  },

  'restaurant-day03': {
    courseId: 'restaurant-day03', scene: 'restaurant', title: '忌口与特殊需求', icon: '餐', day: 3, level: 2,
    duration: '10-15分钟', coreSentence: 'I\'m allergic to nuts.',
    sentences: [
      { order: 1, en: 'I\'m allergic to nuts. Does this dish contain any?', cn: '我对坚果过敏，这道菜含坚果吗？', keywords: ['allergic', 'nuts', 'contain'], tips: '过敏一定要说清楚，关系到健康。' },
      { order: 2, en: 'Could you make it less spicy, please?', cn: '能少放点辣吗？', keywords: ['less', 'spicy'], tips: 'less spicy 少辣；not spicy at all 一点辣都不要。' },
      { order: 3, en: 'Does this soup contain any meat?', cn: '这个汤里含肉吗？', keywords: ['soup', 'contain', 'meat'], tips: '点汤前问清成分，避免踩雷。' },
      { order: 4, en: 'I\'m a vegetarian. Do you have any vegetarian dishes?', cn: '我是素食者，有素菜吗？', keywords: ['vegetarian', 'dishes'], tips: 'vegetarian 素食者；vegan 纯素者。' },
      { order: 5, en: 'Could we have some extra napkins, please?', cn: '能多给我们几张餐巾纸吗？', keywords: ['extra', 'napkins'], tips: 'extra 多加；napkin 餐巾。' }
    ]
  },

  'restaurant-day04': {
    courseId: 'restaurant-day04', scene: 'restaurant', title: '结账买单', icon: '餐', day: 4, level: 1,
    duration: '10-15分钟', coreSentence: 'Could I have the check, please?',
    sentences: [
      { order: 1, en: 'Could I have the check, please?', cn: '请给我账单。', keywords: ['check'], tips: '美式说 check，英式说 bill，都行。' },
      { order: 2, en: 'Can I pay by credit card?', cn: '可以用信用卡付吗？', keywords: ['pay', 'credit', 'card'], tips: 'by credit card 刷卡；by cash 付现金。' },
      { order: 3, en: 'We\'d like to pay separately.', cn: '我们想分开付。', keywords: ['pay', 'separately'], tips: '分开付 separately；一起付 together。' },
      { order: 4, en: 'Keep the change, please.', cn: '不用找零了。', keywords: ['keep', 'change'], tips: '给小费时这句最常用，change 是找零。' },
      { order: 5, en: 'Could you wrap this up for me?', cn: '能帮我把这个打包吗？', keywords: ['wrap', 'up'], tips: '吃不完打包用 wrap up，出国很实用。' },
      { order: 6, en: 'The meal was delicious. Thank you!', cn: '饭菜很美味，谢谢！', keywords: ['meal', 'delicious'], tips: '离开前夸一句，服务员会记住你。' }
    ]
  },

  'restaurant-day05': {
    courseId: 'restaurant-day05', scene: 'restaurant', title: '快餐与外带', icon: '餐', day: 5, level: 1,
    duration: '10-15分钟', coreSentence: 'To go, please.',
    sentences: [
      { order: 1, en: 'I\'d like a cheeseburger and large fries, to go.', cn: '我要一个芝士汉堡和大份薯条，外带。', keywords: ['cheeseburger', 'fries', 'go'], tips: 'for here 堂食；to go 外带，点餐必备。' },
      { order: 2, en: 'Could I get extra ketchup, please?', cn: '能多给我一些番茄酱吗？', keywords: ['extra', 'ketchup'], tips: 'ketchup 番茄酱；mustard 芥末酱。' },
      { order: 3, en: 'What sizes do you have for the drinks?', cn: '饮料有什么杯型？', keywords: ['sizes', 'drinks'], tips: '常见回答：small / medium / large 小中大。' },
      { order: 4, en: 'I\'ll take a medium cola, please.', cn: '我要一杯中杯可乐。', keywords: ['medium', 'cola'], tips: '点饮料先说杯型再说种类，顺序别反。' },
      { order: 5, en: 'How much is that in total?', cn: '一共多少钱？', keywords: ['total'], tips: 'in total 总共，问总价的地道说法。' }
    ]
  },

  'hotel-day06': {
    courseId: 'hotel-day06', scene: 'hotel', title: '预订入住', icon: '宿', day: 6, level: 1,
    duration: '10-15分钟', coreSentence: 'I have a reservation under Wang.',
    sentences: [
      { order: 1, en: 'I have a reservation under the name Wang.', cn: '我用王姓预订了房间。', keywords: ['reservation', 'name', 'wang'], tips: 'under the name 以……的名字预订。' },
      { order: 2, en: 'Here is my passport.', cn: '这是我的护照。', keywords: ['passport'], tips: '入住一般要出示护照，先准备好。' },
      { order: 3, en: 'What time is breakfast served?', cn: '早餐几点供应？', keywords: ['breakfast', 'served'], tips: '问早餐时间用 What time is... served。' },
      { order: 4, en: 'Could we have a room with a view?', cn: '能给我们一间景观房吗？', keywords: ['room', 'view'], tips: 'with a view 带景观的，通常指海景/城景。' },
      { order: 5, en: 'Is there free Wi-Fi in the room?', cn: '房间里有免费无线网吗？', keywords: ['free', 'wifi'], tips: 'Wi-Fi 读音 /ˈwaɪfaɪ/，注意别读错。' },
      { order: 6, en: 'What floor is my room on?', cn: '我的房间在几楼？', keywords: ['floor', 'room'], tips: '英国一楼是 ground floor，美国是一楼 first floor。' }
    ]
  },

  'hotel-day07': {
    courseId: 'hotel-day07', scene: 'hotel', title: '房间问题报修', icon: '宿', day: 7, level: 2,
    duration: '10-15分钟', coreSentence: 'The air conditioner isn\'t working.',
    sentences: [
      { order: 1, en: 'The air conditioner isn\'t working in my room.', cn: '我房间的空调坏了。', keywords: ['air', 'conditioner', 'working'], tips: 'isn\'t working 坏了的常用说法，比 broken 更口语。' },
      { order: 2, en: 'There\'s no hot water in the bathroom.', cn: '浴室没有热水。', keywords: ['hot', 'water', 'bathroom'], tips: 'There\'s no... 没有……，描述缺失最顺口。' },
      { order: 3, en: 'The TV doesn\'t turn on.', cn: '电视打不开。', keywords: ['tv', 'turn', 'on'], tips: 'turn on 打开；打不开就说 doesn\'t turn on。' },
      { order: 4, en: 'Could you send someone to fix it?', cn: '能派人来修一下吗？', keywords: ['send', 'fix'], tips: 'fix 修理；send someone 派人来。' },
      { order: 5, en: 'How long will it take?', cn: '大概要多久？', keywords: ['long', 'take'], tips: 'How long will it take 万能问时长句。' }
    ]
  },

  'hotel-day08': {
    courseId: 'hotel-day08', scene: 'hotel', title: '额外服务请求', icon: '宿', day: 8, level: 1,
    duration: '10-15分钟', coreSentence: 'Could we get an extra towel?',
    sentences: [
      { order: 1, en: 'Could we get an extra towel, please?', cn: '能再给我们一条毛巾吗？', keywords: ['extra', 'towel'], tips: 'towel 毛巾；pillow 枕头；blanket 毯子。' },
      { order: 2, en: 'We need a few more pillows.', cn: '我们需要多几个枕头。', keywords: ['more', 'pillows'], tips: 'a few more 再多几个，数量表达很实用。' },
      { order: 3, en: 'Could you wake me up at seven tomorrow morning?', cn: '明早七点能叫醒我吗？', keywords: ['wake', 'up', 'seven'], tips: 'wake me up 叫醒我；morning call 叫醒服务。' },
      { order: 4, en: 'Could you keep our luggage here until three?', cn: '能把我们的行李存到三点吗？', keywords: ['keep', 'luggage', 'until'], tips: 'luggage 行李（英式）；baggage（美式）。' },
      { order: 5, en: 'We\'d like room service for breakfast.', cn: '我们早餐想用客房送餐。', keywords: ['room', 'service', 'breakfast'], tips: 'room service 客房送餐，电话点餐前先学这句。' }
    ]
  },

  'hotel-day09': {
    courseId: 'hotel-day09', scene: 'hotel', title: '退房离店', icon: '宿', day: 9, level: 1,
    duration: '10-15分钟', coreSentence: 'I\'d like to check out, please.',
    sentences: [
      { order: 1, en: 'I\'d like to check out, please.', cn: '我要退房。', keywords: ['check', 'out'], tips: 'check in 入住；check out 退房，一对反义词。' },
      { order: 2, en: 'Could you prepare my bill, please?', cn: '请准备我的账单。', keywords: ['prepare', 'bill'], tips: 'bill 账单；酒店账单也叫 statement。' },
      { order: 3, en: 'I think there\'s a mistake on the bill.', cn: '我觉得账单上有错误。', keywords: ['mistake', 'bill'], tips: '发现多扣钱别慌，用这句礼貌质疑。' },
      { order: 4, en: 'Could I have a late checkout until one?', cn: '能延迟到一点退房吗？', keywords: ['late', 'checkout'], tips: 'late checkout 延迟退房，很多酒店免费。' },
      { order: 5, en: 'Could you call a taxi for me?', cn: '能帮我叫辆出租车吗？', keywords: ['call', 'taxi'], tips: 'call a taxi 叫出租车，酒店大堂都乐意帮忙。' },
      { order: 6, en: 'Thank you for your help. Goodbye!', cn: '谢谢你的帮助，再见！', keywords: ['thank', 'help', 'goodbye'], tips: '退房离开，礼貌收尾很加分。' }
    ]
  },

  'transport-day10': {
    courseId: 'transport-day10', scene: 'transport', title: '打车出行', icon: '行', day: 10, level: 1,
    duration: '10-15分钟', coreSentence: 'Please take me to the airport.',
    sentences: [
      { order: 1, en: 'Please take me to the airport.', cn: '请送我去机场。', keywords: ['take', 'airport'], tips: 'take me to... 带我去……，上车第一句。' },
      { order: 2, en: 'Could you turn on the meter, please?', cn: '请打表计费。', keywords: ['turn', 'meter'], tips: 'meter 计价器，要求打表防被宰。' },
      { order: 3, en: 'How long will it take to get there?', cn: '到那里要多久？', keywords: ['long', 'take', 'get'], tips: '问时长万能句，好安排时间。' },
      { order: 4, en: 'Could you drive a little faster? I\'m in a hurry.', cn: '能开快一点吗？我赶时间。', keywords: ['faster', 'hurry'], tips: 'in a hurry 赶时间，催促时用。' },
      { order: 5, en: 'Please stop here. How much is it?', cn: '请停这里，多少钱？', keywords: ['stop', 'how', 'much'], tips: '到地方先停，再问价。' },
      { order: 6, en: 'Keep the change, please.', cn: '不用找零了。', keywords: ['keep', 'change'], tips: '留作小费，司机通常很开心。' }
    ]
  },

  'transport-day11': {
    courseId: 'transport-day11', scene: 'transport', title: '地铁与公交', icon: '行', day: 11, level: 1,
    duration: '10-15分钟', coreSentence: 'Which line goes to the museum?',
    sentences: [
      { order: 1, en: 'Which line goes to the museum?', cn: '哪条线到博物馆？', keywords: ['line', 'museum'], tips: '问地铁线路，line 线路。' },
      { order: 2, en: 'Where can I buy a ticket?', cn: '在哪里买票？', keywords: ['buy', 'ticket'], tips: 'ticket 票；售票处 ticket office。' },
      { order: 3, en: 'A one-day pass, please.', cn: '请给我一张一日通票。', keywords: ['pass', 'day'], tips: 'one-day pass 一日通票，游客省钱利器。' },
      { order: 4, en: 'How many stops is it to the city center?', cn: '到市中心有几站？', keywords: ['stops', 'city', 'center'], tips: '问站数用 How many stops。' },
      { order: 5, en: 'Which exit should I take?', cn: '我应该从哪个出口出？', keywords: ['exit', 'take'], tips: '地铁出口 exit，常标 A/B/C/D 口。' },
      { order: 6, en: 'Could you tell me when to get off?', cn: '到站时能提醒我下车吗？', keywords: ['tell', 'get', 'off'], tips: 'get off 下车（公交地铁）；get in 上车（小车）。' }
    ]
  },

  'transport-day12': {
    courseId: 'transport-day12', scene: 'transport', title: '机场值机选座', icon: '行', day: 12, level: 1,
    duration: '10-15分钟', coreSentence: 'I\'d prefer a window seat.',
    sentences: [
      { order: 1, en: 'I\'d like to check in for flight CA985.', cn: '我要办理 CA985 航班的登机手续。', keywords: ['check', 'flight'], tips: 'check in for... 办理……航班的值机。' },
      { order: 2, en: 'I\'d prefer a window seat, please.', cn: '我比较想要靠窗的位子。', keywords: ['prefer', 'window', 'seat'], tips: 'prefer 更喜欢；window seat 靠窗，aisle seat 过道。' },
      { order: 3, en: 'I have one suitcase to check.', cn: '我有一件行李要托运。', keywords: ['suitcase', 'check'], tips: 'suitcase 行李箱；to check 托运（动词）。' },
      { order: 4, en: 'Is my luggage overweight?', cn: '我的行李超重吗？', keywords: ['luggage', 'overweight'], tips: 'overweight 超重；免费额度 free allowance。' },
      { order: 5, en: 'What time does boarding start?', cn: '什么时候开始登机？', keywords: ['boarding', 'start'], tips: 'boarding 登机；boarding pass 登机牌。' },
      { order: 6, en: 'Which gate do I need to go to?', cn: '我要去哪个登机口？', keywords: ['gate'], tips: 'gate 登机口，值机后确认编号。' }
    ]
  },

  'transport-day13': {
    courseId: 'transport-day13', scene: 'transport', title: '问路指路', icon: '行', day: 13, level: 1,
    duration: '10-15分钟', coreSentence: 'How do I get to the train station?',
    sentences: [
      { order: 1, en: 'Excuse me, how do I get to the train station?', cn: '请问去火车站怎么走？', keywords: ['get', 'train', 'station'], tips: '问路万能句，把地点换掉就能用。' },
      { order: 2, en: 'Is it far from here?', cn: '离这里远吗？', keywords: ['far'], tips: '判断远近，决定走路还是打车。' },
      { order: 3, en: 'Can I walk there?', cn: '我可以走过去吗？', keywords: ['walk'], tips: 'walk there 走过去；步行范围 walkable。' },
      { order: 4, en: 'Should I turn left or right at the corner?', cn: '在拐角处该左转还是右转？', keywords: ['turn', 'left', 'right'], tips: 'turn left 左转；turn right 右转；go straight 直走。' },
      { order: 5, en: 'Could you show me on the map?', cn: '能在地图上给我指一下吗？', keywords: ['show', 'map'], tips: '语言不通时，让指地图最直观。' },
      { order: 6, en: 'Thank you, that\'s very helpful.', cn: '谢谢，太有帮助了。', keywords: ['thank', 'helpful'], tips: '问完路道谢，helpful 有帮助的。' }
    ]
  },

  'shopping-day14': {
    courseId: 'shopping-day14', scene: 'shopping', title: '商场选购礼物', icon: '购', day: 14, level: 1,
    duration: '10-15分钟', coreSentence: 'I\'m looking for a gift for my mother.',
    sentences: [
      { order: 1, en: 'I\'m looking for a gift for my mother.', cn: '我想给妈妈挑一件礼物。', keywords: ['looking', 'gift', 'mother'], tips: 'look for 寻找；gift 礼物（美式偏 gift）。' },
      { order: 2, en: 'What do you think she would like?', cn: '你觉得她会喜欢什么？', keywords: ['think', 'would', 'like'], tips: '征询店员建议，she would like 她会喜欢。' },
      { order: 3, en: 'Could you show me that scarf?', cn: '能给我看看那条围巾吗？', keywords: ['show', 'scarf'], tips: 'scarf 围巾；jewelry 首饰；perfume 香水。' },
      { order: 4, en: 'How much does it cost?', cn: '这个多少钱？', keywords: ['much', 'cost'], tips: '问价格最常用句，cost 花费。' },
      { order: 5, en: 'Could you wrap it as a gift?', cn: '能把它包成礼品吗？', keywords: ['wrap', 'gift'], tips: 'gift wrap 礼品包装，送礼前问这句。' }
    ]
  },

  'shopping-day15': {
    courseId: 'shopping-day15', scene: 'shopping', title: '超市找商品', icon: '购', day: 15, level: 1,
    duration: '10-15分钟', coreSentence: 'Where can I find the dairy section?',
    sentences: [
      { order: 1, en: 'Where can I find the dairy section?', cn: '乳制品区在哪里？', keywords: ['find', 'dairy', 'section'], tips: 'dairy 乳制品；section 区域，找货架就问 where...。' },
      { order: 2, en: 'Do you have any fresh bread?', cn: '有新鲜面包吗？', keywords: ['fresh', 'bread'], tips: 'fresh 新鲜的；bakery 烘焙区。' },
      { order: 3, en: 'Is this on sale today?', cn: '这个今天打折吗？', keywords: ['sale'], tips: 'on sale 打折促销；regular price 原价。' },
      { order: 4, en: 'Could I get a plastic bag, please?', cn: '能给我一个塑料袋吗？', keywords: ['plastic', 'bag'], tips: '有些国家塑料袋收费，先问一句。' },
      { order: 5, en: 'Where is the checkout counter?', cn: '收银台在哪里？', keywords: ['checkout', 'counter'], tips: 'checkout counter 收银台，结账处。' }
    ]
  },

  'shopping-day16': {
    courseId: 'shopping-day16', scene: 'shopping', title: '试穿与尺码', icon: '购', day: 16, level: 1,
    duration: '10-15分钟', coreSentence: 'Do you have this in a larger size?',
    sentences: [
      { order: 1, en: 'Do you have this in a larger size?', cn: '这个有大一号的吗？', keywords: ['larger', 'size'], tips: 'larger size 大一码；smaller 小一码。' },
      { order: 2, en: 'Could I try it on?', cn: '我可以试穿吗？', keywords: ['try', 'on'], tips: 'try on 试穿；试衣间 fitting room。' },
      { order: 3, en: 'Where is the fitting room?', cn: '试衣间在哪里？', keywords: ['fitting', 'room'], tips: 'fitting room 试衣间，也叫 dressing room。' },
      { order: 4, en: 'It fits me well. I\'ll take it.', cn: '很合身，我买了。', keywords: ['fits', 'take'], tips: 'fit 合身；take it 决定购买。' },
      { order: 5, en: 'Do you have this in another color?', cn: '这个有别的颜色吗？', keywords: ['another', 'color'], tips: 'another color 另一种颜色。' }
    ]
  },

  'shopping-day17': {
    courseId: 'shopping-day17', scene: 'shopping', title: '退换货', icon: '购', day: 17, level: 2,
    duration: '10-15分钟', coreSentence: 'Can I return this without a receipt?',
    sentences: [
      { order: 1, en: 'Can I return this? It doesn\'t fit.', cn: '这个能退吗？不合身。', keywords: ['return', 'fit'], tips: 'return 退货；exchange 换货。' },
      { order: 2, en: 'I\'d like to exchange it for a smaller one.', cn: '我想换一个小一号的。', keywords: ['exchange', 'smaller'], tips: 'exchange A for B 用 A 换 B。' },
      { order: 3, en: 'Can I return this without a receipt?', cn: '没有小票能退吗？', keywords: ['return', 'receipt'], tips: 'receipt 收据小票；丢了也别慌，先问这句。' },
      { order: 4, en: 'What\'s your return policy?', cn: '你们的退货政策是什么？', keywords: ['return', 'policy'], tips: 'policy 政策；一般 14-30 天内可退。' },
      { order: 5, en: 'Could I get a refund instead?', cn: '能退款吗？', keywords: ['refund'], tips: 'refund 退款；退款到卡上 refund to my card。' }
    ]
  },

  'social-day18': {
    courseId: 'social-day18', scene: 'social', title: '初次见面寒暄', icon: '友', day: 18, level: 1,
    duration: '10-15分钟', coreSentence: 'Nice to meet you. I\'m from China.',
    sentences: [
      { order: 1, en: 'Nice to meet you. I\'m from China.', cn: '很高兴认识你，我来自中国。', keywords: ['nice', 'meet', 'china'], tips: '初次见面自我介绍，from 后面接国家。' },
      { order: 2, en: 'This is my first time visiting your country.', cn: '这是我第一次来你们国家。', keywords: ['first', 'time', 'visiting'], tips: 'first time doing 第一次做某事。' },
      { order: 3, en: 'I really like it here.', cn: '我很喜欢这里。', keywords: ['really', 'like', 'here'], tips: '夸当地，好感度立刻拉满。' },
      { order: 4, en: 'What do you do for a living?', cn: '你是做什么工作的？', keywords: ['living'], tips: '问职业的地道说法，do for a living 谋生。' },
      { order: 5, en: 'I\'m a teacher. How about you?', cn: '我是老师，你呢？', keywords: ['teacher', 'about', 'you'], tips: '回答后反问 How about you，让对话继续。' },
      { order: 6, en: 'I hope we can see each other again.', cn: '希望我们能再见面。', keywords: ['hope', 'each', 'other'], tips: 'each other 彼此；结尾客套句。' }
    ]
  },

  'social-day19': {
    courseId: 'social-day19', scene: 'social', title: '日常闲聊', icon: '友', day: 19, level: 1,
    duration: '10-15分钟', coreSentence: 'How long have you lived here?',
    sentences: [
      { order: 1, en: 'How long have you lived here?', cn: '你在这里住多久了？', keywords: ['long', 'lived'], tips: 'have lived 现在完成时，问居住时长。' },
      { order: 2, en: 'The weather is lovely today, isn\'t it?', cn: '今天天气真好，是吧？', keywords: ['weather', 'lovely'], tips: '天气开场白最安全，isn\'t it 反问拉近距离。' },
      { order: 3, en: 'Do you come here often?', cn: '你常来这儿吗？', keywords: ['come', 'often'], tips: 'often 经常；闲聊暖场句。' },
      { order: 4, en: 'What do you usually do on weekends?', cn: '你周末通常做什么？', keywords: ['usually', 'weekends'], tips: 'usually 通常；on weekends 在周末。' },
      { order: 5, en: 'That sounds interesting.', cn: '听起来很有意思。', keywords: ['sounds', 'interesting'], tips: '对对方话题表示兴趣，万能回应句。' }
    ]
  },

  'social-day20': {
    courseId: 'social-day20', scene: 'social', title: '道别告别', icon: '友', day: 20, level: 1,
    duration: '10-15分钟', coreSentence: 'It was great meeting you.',
    sentences: [
      { order: 1, en: 'It was great meeting you.', cn: '认识你真好。', keywords: ['great', 'meeting'], tips: '道别时说 It was great meeting you，注意用 was。' },
      { order: 2, en: 'Thank you for the wonderful evening.', cn: '谢谢你给了我一个美好的夜晚。', keywords: ['wonderful', 'evening'], tips: '感谢款待，wonderful 精彩的。' },
      { order: 3, en: 'I really enjoyed our conversation.', cn: '我很享受我们的聊天。', keywords: ['enjoyed', 'conversation'], tips: 'conversation 谈话；enjoy 享受。' },
      { order: 4, en: 'Let\'s keep in touch.', cn: '我们保持联系吧。', keywords: ['keep', 'touch'], tips: 'keep in touch 保持联系，告别常用。' },
      { order: 5, en: 'Take care and have a safe trip home.', cn: '保重，回家路上注意安全。', keywords: ['take', 'care', 'safe'], tips: 'take care 保重；safe trip 一路平安。' },
      { order: 6, en: 'Goodbye! See you next time!', cn: '再见！下次见！', keywords: ['goodbye', 'next', 'time'], tips: 'see you next time 期待再见。' }
    ]
  },

  'bank-day21': {
    courseId: 'bank-day21', scene: 'bank', title: '银行换汇', icon: '银', day: 21, level: 2,
    duration: '10-15分钟', coreSentence: 'I\'d like to exchange some US dollars.',
    sentences: [
      { order: 1, en: 'I\'d like to exchange some US dollars, please.', cn: '我想换一些美元。', keywords: ['exchange', 'dollars'], tips: 'exchange 兑换；换汇柜台 exchange counter。' },
      { order: 2, en: 'What\'s the exchange rate today?', cn: '今天的汇率是多少？', keywords: ['exchange', 'rate'], tips: 'exchange rate 汇率；问汇率防被宰。' },
      { order: 3, en: 'Is there a service fee for exchanging money?', cn: '换汇收手续费吗？', keywords: ['service', 'fee'], tips: 'service fee 手续费；commission 佣金。' },
      { order: 4, en: 'I\'d like it in smaller bills, please.', cn: '请给我小面额的钞票。', keywords: ['smaller', 'bills'], tips: 'bill 纸币；smaller bills 小面额，方便付小费。' },
      { order: 5, en: 'Could I have the receipt, please?', cn: '请给我收据。', keywords: ['receipt'], tips: '换汇凭证要收好，离境有时要出示。' }
    ]
  },

  'bank-day22': {
    courseId: 'bank-day22', scene: 'bank', title: 'ATM 与取款', icon: '银', day: 22, level: 1,
    duration: '10-15分钟', coreSentence: 'Where is the nearest ATM?',
    sentences: [
      { order: 1, en: 'Where is the nearest ATM?', cn: '最近的取款机在哪里？', keywords: ['nearest', 'atm'], tips: 'nearest 最近的；ATM 全称 automatic teller machine。' },
      { order: 2, en: 'Does this ATM accept foreign cards?', cn: '这台取款机接受外国卡吗？', keywords: ['accept', 'foreign', 'cards'], tips: 'accept 接受；foreign cards 外国卡。' },
      { order: 3, en: 'My card was swallowed by the machine.', cn: '我的卡被机器吞了。', keywords: ['card', 'swallowed'], tips: 'swallow 吞；被吞卡找银行柜员。' },
      { order: 4, en: 'Could you help me check my balance?', cn: '能帮我查一下余额吗？', keywords: ['check', 'balance'], tips: 'balance 余额；check balance 查余额。' },
      { order: 5, en: 'I\'d like to withdraw some cash.', cn: '我想取一些现金。', keywords: ['withdraw', 'cash'], tips: 'withdraw 取款；deposit 存款。' }
    ]
  },

  'medical-day23': {
    courseId: 'medical-day23', scene: 'medical', title: '挂号就诊', icon: '医', day: 23, level: 2,
    duration: '10-15分钟', coreSentence: 'I\'d like to see a doctor.',
    sentences: [
      { order: 1, en: 'I\'d like to see a doctor, please.', cn: '我想看医生。', keywords: ['see', 'doctor'], tips: 'see a doctor 看医生，挂号第一句。' },
      { order: 2, en: 'Do I need an appointment?', cn: '需要预约吗？', keywords: ['appointment'], tips: 'appointment 预约；急诊 emergency 不用约。' },
      { order: 3, en: 'I\'d like to make an appointment for tomorrow.', cn: '我想约明天的时间。', keywords: ['make', 'appointment'], tips: 'make an appointment 预约。' },
      { order: 4, en: 'Is there a doctor who speaks English?', cn: '有会说英语的医生吗？', keywords: ['doctor', 'speaks', 'english'], tips: '旅行就医常用，先找能沟通的医生。' },
      { order: 5, en: 'How much is the consultation fee?', cn: '挂号费多少钱？', keywords: ['consultation', 'fee'], tips: 'consultation 问诊；consultation fee 诊费。' }
    ]
  },

  'medical-day24': {
    courseId: 'medical-day24', scene: 'medical', title: '描述症状', icon: '医', day: 24, level: 2,
    duration: '10-15分钟', coreSentence: 'I\'ve had a fever since yesterday.',
    sentences: [
      { order: 1, en: 'I\'ve had a fever since yesterday.', cn: '我从昨天开始发烧。', keywords: ['fever', 'since', 'yesterday'], tips: 'have a fever 发烧；since 自从，配现在完成时。' },
      { order: 2, en: 'I have a sore throat and a cough.', cn: '我喉咙痛还咳嗽。', keywords: ['sore', 'throat', 'cough'], tips: 'sore throat 喉咙痛；cough 咳嗽。' },
      { order: 3, en: 'I feel dizzy and tired all the time.', cn: '我头晕，总觉得累。', keywords: ['dizzy', 'tired'], tips: 'dizzy 头晕；all the time 一直。' },
      { order: 4, en: 'It started last night.', cn: '从昨晚开始的。', keywords: ['started', 'last', 'night'], tips: '医生常问什么时候开始的，这句回答。' },
      { order: 5, en: 'Is it serious, doctor?', cn: '医生，严重吗？', keywords: ['serious'], tips: 'serious 严重的；放心问出口。' },
      { order: 6, en: 'Could you prescribe me some medicine?', cn: '能给我开点药吗？', keywords: ['prescribe', 'medicine'], tips: 'prescribe 开药方；medicine 药。' }
    ]
  },

  'medical-day25': {
    courseId: 'medical-day25', scene: 'medical', title: '药房买药', icon: '医', day: 25, level: 2,
    duration: '10-15分钟', coreSentence: 'How often should I take this medicine?',
    sentences: [
      { order: 1, en: 'I need something for my headache.', cn: '我需要治头疼的药。', keywords: ['headache'], tips: 'headache 头疼；stomachache 胃痛；toothache 牙痛。' },
      { order: 2, en: 'How often should I take this medicine?', cn: '这个药多久吃一次？', keywords: ['often', 'take', 'medicine'], tips: 'How often 问频率；take medicine 吃药。' },
      { order: 3, en: 'How many tablets should I take each time?', cn: '每次吃几片？', keywords: ['tablets', 'each', 'time'], tips: 'tablet 药片；capsule 胶囊。' },
      { order: 4, en: 'Are there any side effects?', cn: '有什么副作用吗？', keywords: ['side', 'effects'], tips: 'side effects 副作用；drowsy 犯困。' },
      { order: 5, en: 'Should I take it before or after meals?', cn: '饭前还是饭后吃？', keywords: ['before', 'after', 'meals'], tips: 'before meals 饭前；after meals 饭后。' }
    ]
  },

  'telecom-day26': {
    courseId: 'telecom-day26', scene: 'telecom', title: '打电话找人', icon: '话', day: 26, level: 1,
    duration: '10-15分钟', coreSentence: 'May I speak to Mr. Smith, please?',
    sentences: [
      { order: 1, en: 'May I speak to Mr. Smith, please?', cn: '请找史密斯先生接电话。', keywords: ['speak', 'smith'], tips: '电话万能句 May I speak to... 比 I want 礼貌。' },
      { order: 2, en: 'This is Wang speaking.', cn: '我是小王。', keywords: ['wang', 'speaking'], tips: '电话里自我介绍说 This is... speaking。' },
      { order: 3, en: 'Could you take a message for me?', cn: '能帮我捎个口信吗？', keywords: ['take', 'message'], tips: 'take a message 捎口信；leave a message 留言。' },
      { order: 4, en: 'Could you ask him to call me back?', cn: '能让他给我回电话吗？', keywords: ['call', 'back'], tips: 'call back 回电；留下自己的号码。' },
      { order: 5, en: 'I\'m afraid you have the wrong number.', cn: '恐怕你打错电话了。', keywords: ['wrong', 'number'], tips: 'wrong number 错号；礼貌挂断。' },
      { order: 6, en: 'Let me write down the number.', cn: '我记一下号码。', keywords: ['write', 'down', 'number'], tips: 'write down 记下；说完谢谢再挂。' }
    ]
  },

  'help-day27': {
    courseId: 'help-day27', scene: 'help', title: '迷路紧急求助', icon: '救', day: 27, level: 2,
    duration: '10-15分钟', coreSentence: 'Can you help me? I think I\'m lost.',
    sentences: [
      { order: 1, en: 'Can you help me? I think I\'m lost.', cn: '能帮帮我吗？我好像迷路了。', keywords: ['help', 'lost'], tips: 'lost 迷路的；紧急求助先开口。' },
      { order: 2, en: 'I can\'t find my hotel.', cn: '我找不到我的酒店了。', keywords: ['find', 'hotel'], tips: '找不到地方就用 can\'t find...。' },
      { order: 3, en: 'Could you call a taxi for me?', cn: '能帮我叫辆出租车吗？', keywords: ['call', 'taxi'], tips: '迷路时叫车最稳妥。' },
      { order: 4, en: 'Is there a police station nearby?', cn: '附近有警察局吗？', keywords: ['police', 'station', 'nearby'], tips: 'police station 警察局；nearby 附近。' },
      { order: 5, en: 'I\'ve lost my wallet. What should I do?', cn: '我钱包丢了，该怎么办？', keywords: ['lost', 'wallet'], tips: '丢东西先报警，再联系银行挂失。' }
    ]
  },

  'life-day28': {
    courseId: 'life-day28', scene: 'life', title: '理发服务', icon: '活', day: 28, level: 1,
    duration: '10-15分钟', coreSentence: 'Just a trim, please. Not too short.',
    sentences: [
      { order: 1, en: 'Just a trim, please. Not too short.', cn: '稍微修一下，别太短。', keywords: ['trim', 'short'], tips: 'trim 修剪；强调别太短 Not too short。' },
      { order: 2, en: 'Could you wash my hair first?', cn: '能先给我洗个头吗？', keywords: ['wash', 'hair'], tips: 'wash hair 洗头；理发店标配流程。' },
      { order: 3, en: 'A little more off the sides, please.', cn: '两边再剪短一点。', keywords: ['sides'], tips: 'sides 两侧；off 剪掉（多少）。' },
      { order: 4, en: 'That looks great. Thank you!', cn: '看起来很好，谢谢！', keywords: ['looks', 'great'], tips: '满意就夸，理发师很开心。' },
      { order: 5, en: 'How much is it for a haircut?', cn: '剪头发多少钱？', keywords: ['haircut'], tips: 'haircut 理发；结账前先问价。' }
    ]
  },

  'life-day29': {
    courseId: 'life-day29', scene: 'life', title: '洗衣与送洗', icon: '活', day: 29, level: 1,
    duration: '10-15分钟', coreSentence: 'When will they be ready?',
    sentences: [
      { order: 1, en: 'I\'d like to have these clothes washed.', cn: '我想洗这些衣服。', keywords: ['clothes', 'washed'], tips: 'have...washed 让别人洗；洗衣店 laundry。' },
      { order: 2, en: 'When will they be ready?', cn: '什么时候能洗好？', keywords: ['ready'], tips: 'ready 准备好；问取衣时间。' },
      { order: 3, en: 'This shirt needs ironing.', cn: '这件衬衫需要熨烫。', keywords: ['shirt', 'ironing'], tips: 'iron 熨烫；熨好的衣服 wrinkle-free。' },
      { order: 4, en: 'There\'s a stain here. Could you remove it?', cn: '这里有个污渍，能去掉吗？', keywords: ['stain', 'remove'], tips: 'stain 污渍；remove 去除。' },
      { order: 5, en: 'Could you be careful with this silk dress?', cn: '这条真丝裙子请小心处理。', keywords: ['careful', 'silk', 'dress'], tips: 'silk 丝绸；贵重衣物要提醒。' }
    ]
  },

  'life-day30': {
    courseId: 'life-day30', scene: 'life', title: '寄快递回国', icon: '活', day: 30, level: 1,
    duration: '10-15分钟', coreSentence: 'I\'d like to send this to China.',
    sentences: [
      { order: 1, en: 'I\'d like to send this package to China.', cn: '我想把这个包裹寄到中国。', keywords: ['send', 'package', 'china'], tips: 'package 包裹；寄回国 send to China。' },
      { order: 2, en: 'How long will it take to arrive?', cn: '多久能寄到？', keywords: ['long', 'arrive'], tips: 'arrive 到达；国际快递一般一周左右。' },
      { order: 3, en: 'What\'s the postage for this?', cn: '这个邮费多少钱？', keywords: ['postage'], tips: 'postage 邮资；shipping 运费。' },
      { order: 4, en: 'Could I send it by air mail?', cn: '可以寄航空件吗？', keywords: ['air', 'mail'], tips: 'air mail 航空邮件，比海运快。' },
      { order: 5, en: 'I need to fill in this form, right?', cn: '我需要填这个表格，对吗？', keywords: ['fill', 'form'], tips: 'fill in a form 填表；海关申报单别漏。' }
    ]
  }
};
