/**
 * js/data-listening.js - 慢速听力 30 段对话（内容包）
 * 每段 80-120 词、8-12 句，主题与场景课程刻意错位（机场/海关/超市/药店等）。
 * 三步法：先无字幕 → 英文字幕 → 中英字幕，逐句播放，单词可轻点加入生词本。
 * 由 data.js 聚合为 CONTENT.listening。
 */

const LISTENING_DATA = {
  'listen-01': {
    id: 'listen-01', scene: 'airport', title: '机场值机选座', icon: '值', day: 1,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning. I\'d like to check in for flight CA982 to Paris.', cn: '早上好，我想办理飞往巴黎的 CA982 航班的登机手续。', words: ['check in', 'flight'] },
      { en: 'May I see your passport, please?', cn: '请出示您的护照。', words: ['passport'] },
      { en: 'Here you are. Could I have a window seat?', cn: '给您。我能要一个靠窗的座位吗？', words: ['window seat'] },
      { en: 'Sure. Would you prefer an aisle seat or a window seat?', cn: '当然。您想要靠过道还是靠窗的座位？', words: ['aisle', 'prefer'] },
      { en: 'Window, please. Also, is my bag within the weight limit?', cn: '靠窗的，谢谢。另外，我的行李在重量限制内吗？', words: ['weight limit'] },
      { en: 'Let me check. It\'s 21 kilos, that\'s fine.', cn: '我看看。21 公斤，没问题。', words: ['kilo'] },
      { en: 'How many bags are you checking in?', cn: '您要托运几件行李？', words: ['bag'] },
      { en: 'Just one. I\'ll carry this small one with me.', cn: '就一件。这个小包我随身带。', words: ['carry'] },
      { en: 'Okay. Here is your boarding pass. The gate is B26.', cn: '好的，这是您的登机牌，登机口是 B26。', words: ['boarding pass', 'gate'] },
      { en: 'Thank you. Which gate is it again? I\'m a little nervous.', cn: '谢谢。登机口是哪个来着？我有点紧张。', words: ['nervous'] },
      { en: 'Gate B26. Boarding starts at 9:40. Have a nice flight!', cn: 'B26 登机口，9 点 40 分开始登机。祝您旅途愉快！', words: ['boarding'] }
    ]
  },

  'listen-02': {
    id: 'listen-02', scene: 'border', title: '海关申报', icon: '关', day: 2,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Welcome to the UK. May I see your passport and declaration form?', cn: '欢迎来到英国。请出示您的护照和申报单。', words: ['declaration', 'form'] },
      { en: 'Here they are.', cn: '给您。', words: [] },
      { en: 'How long will you be staying?', cn: '您打算待多久？', words: ['staying'] },
      { en: 'Ten days. I\'m here for a family visit.', cn: '十天，我是来探亲的。', words: ['family visit'] },
      { en: 'What is the purpose of your visit?', cn: '您此行的目的是什么？', words: ['purpose'] },
      { en: 'Visiting my daughter and doing some sightseeing.', cn: '看望我女儿，顺便观光旅游。', words: ['sightseeing'] },
      { en: 'Do you have anything to declare?', cn: '您有需要申报的物品吗？', words: ['declare'] },
      { en: 'No, just personal items and some small gifts.', cn: '没有，只有个人物品和一些小礼物。', words: ['personal items'] },
      { en: 'How much cash are you carrying?', cn: '您随身携带多少现金？', words: ['cash'] },
      { en: 'About two thousand dollars.', cn: '大约两千美元。', words: ['thousand'] },
      { en: 'That\'s within the limit. Enjoy your stay!', cn: '在限额以内。祝您旅途愉快！', words: ['limit'] }
    ]
  },

  'listen-03': {
    id: 'listen-03', scene: 'airport', title: '航班延误通知', icon: '延', day: 3,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Attention, passengers. Flight CA982 is delayed.', cn: '各位旅客请注意，CA982 航班延误了。', words: ['delayed'] },
      { en: 'Oh no. How long is the delay?', cn: '天哪，要延误多久？', words: ['delay'] },
      { en: 'The flight is expected to depart at 11:30, two hours later.', cn: '航班预计 11 点 30 分起飞，晚点两个小时。', words: ['depart', 'expected'] },
      { en: 'Will we still be able to catch our connection?', cn: '我们还能赶上转机航班吗？', words: ['connection'] },
      { en: 'The airline will rebook you on the next available flight.', cn: '航空公司会为您改签下一班可用的航班。', words: ['rebook', 'available'] },
      { en: 'Is there a meal voucher for us?', cn: '有没有给我们餐券？', words: ['voucher'] },
      { en: 'Yes, please go to counter 12 for meal vouchers.', cn: '有的，请到 12 号柜台领取餐券。', words: ['counter'] },
      { en: 'Where can we wait? Is there a lounge?', cn: '我们可以在哪里等？有休息室吗？', words: ['lounge'] },
      { en: 'There\'s a waiting area near Gate B26 with free Wi-Fi.', cn: 'B26 登机口附近有等候区，提供免费 Wi-Fi。', words: ['waiting area', 'Wi-Fi'] },
      { en: 'Thank you for letting us know.', cn: '谢谢您告诉我们。', words: ['let us know'] },
      { en: 'We apologize for the inconvenience.', cn: '给您带来不便，我们深表歉意。', words: ['apologize', 'inconvenience'] }
    ]
  },

  'listen-04': {
    id: 'listen-04', scene: 'taxi', title: '出租车绕路', icon: '车', day: 4,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning. Could you take me to the central station, please?', cn: '早上好，能送我去中央车站吗？', words: ['central station'] },
      { en: 'Sure, get in. Is this your first time in this city?', cn: '好的，请上车。您是第一次来这个城市吗？', words: ['get in'] },
      { en: 'Yes, it is. How long will it take?', cn: '是的。大概要多久？', words: ['how long'] },
      { en: 'About twenty minutes without traffic.', cn: '不堵车的话大概二十分钟。', words: ['traffic'] },
      { en: 'Excuse me, are you sure this is the right way?', cn: '打扰一下，您确定这条路对吗？', words: ['right way'] },
      { en: 'Yes, I\'m taking the ring road to avoid traffic.', cn: '对，我走环城路来避开堵车。', words: ['ring road', 'avoid'] },
      { en: 'But the meter is going up very fast.', cn: '可是计价器跳得很快。', words: ['meter'] },
      { en: 'Don\'t worry, the ring road is shorter in the end.', cn: '别担心，走环城路最后反而更近。', words: ['shorter'] },
      { en: 'Could we agree on a fixed price instead?', cn: '我们能商量一个固定价格吗？', words: ['fixed price'] },
      { en: 'I\'m sorry, but that\'s not allowed here.', cn: '抱歉，这里不允许这样。', words: ['allowed'] },
      { en: 'Okay. Please just take the quickest route.', cn: '好吧，那就请走最快的路线。', words: ['quickest route'] }
    ]
  },

  'listen-05': {
    id: 'listen-05', scene: 'hotel', title: '酒店房间升级', icon: '升', day: 5,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hello, I\'d like to check in. My name is Lin Wang.', cn: '你好，我想办理入住，我叫王琳。', words: ['check in'] },
      { en: 'Let me look it up. You have a standard room for two nights.', cn: '我查一下。您订的是两晚标准间。', words: ['standard room'] },
      { en: 'That\'s right. Is there any chance of an upgrade?', cn: '是的。有没有机会升级房间？', words: ['upgrade'] },
      { en: 'We have a deluxe room with a sea view available.', cn: '我们有一间带海景的豪华房。', words: ['deluxe', 'sea view'] },
      { en: 'How much more is it per night?', cn: '每晚要多加多少钱？', words: ['per night'] },
      { en: 'Forty dollars more. Would you like it?', cn: '每晚多 40 美元。您要吗？', words: ['dollar'] },
      { en: 'Yes, please. That sounds lovely.', cn: '要的，听上去不错。', words: ['lovely'] },
      { en: 'Great. Your room is 1208 on the twelfth floor.', cn: '好的。您的房间是 12 楼的 1208 号。', words: ['floor'] },
      { en: 'Is breakfast included?', cn: '含早餐吗？', words: ['breakfast', 'included'] },
      { en: 'Yes, breakfast is from 7 to 10 in the lobby restaurant.', cn: '含的，早餐 7 点到 10 点在大堂餐厅。', words: ['lobby'] }
    ]
  },

  'listen-06': {
    id: 'listen-06', scene: 'restaurant', title: '牛排熟度', icon: '牛', day: 6,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Are you ready to order, sir?', cn: '先生，您准备好点餐了吗？', words: ['order'] },
      { en: 'Yes. I\'d like the ribeye steak, please.', cn: '是的，我要一份肋眼牛排。', words: ['ribeye', 'steak'] },
      { en: 'How would you like it cooked?', cn: '您想要几分熟？', words: ['cooked'] },
      { en: 'Medium rare, please. Not too bloody.', cn: '三分熟，不要太生。', words: ['medium rare'] },
      { en: 'Would you like a side dish?', cn: '需要配菜吗？', words: ['side dish'] },
      { en: 'What do you recommend?', cn: '你有什么推荐的？', words: ['recommend'] },
      { en: 'The roasted potatoes with herbs are very popular.', cn: '香草烤土豆很受欢迎。', words: ['roasted', 'popular'] },
      { en: 'I\'ll have those, please.', cn: '那就来一份吧。', words: ['have those'] },
      { en: 'And what about drinks?', cn: '那喝的呢？', words: ['drinks'] },
      { en: 'A glass of red wine, please.', cn: '一杯红葡萄酒，谢谢。', words: ['wine'] },
      { en: 'Anything else?', cn: '还需要别的吗？', words: ['anything else'] },
      { en: 'No, that\'s all. Thank you.', cn: '不用了，就这些。谢谢。', words: ['that\'s all'] }
    ]
  },

  'listen-07': {
    id: 'listen-07', scene: 'supermarket', title: '超市自助结账', icon: '超', day: 7,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Excuse me, is this the self-checkout line?', cn: '打扰一下，这是自助结账的队伍吗？', words: ['self-checkout'] },
      { en: 'Yes, it is. Do you know how to use the machine?', cn: '是的。您会用这台机器吗？', words: ['machine'] },
      { en: 'Not really. It\'s my first time.', cn: '不太会，这是我第一次用。', words: ['first time'] },
      { en: 'No problem. First, scan your items one by one.', cn: '没关系。先把商品一件件扫码。', words: ['scan', 'item'] },
      { en: 'Got it. What if an item doesn\'t have a barcode?', cn: '明白了。要是商品没有条形码怎么办？', words: ['barcode'] },
      { en: 'Then use the search screen and pick the item by name.', cn: '那就用屏幕上的搜索功能，按名字选商品。', words: ['search screen'] },
      { en: 'How do I pay?', cn: '怎么付款？', words: ['pay'] },
      { en: 'You can tap your card or use your phone.', cn: '可以刷银行卡或者用手机支付。', words: ['tap'] },
      { en: 'Do you accept cash here?', cn: '这里收现金吗？', words: ['accept', 'cash'] },
      { en: 'Sorry, self-checkout only takes card or phone.', cn: '抱歉，自助结账只支持刷卡或手机支付。', words: ['only'] },
      { en: 'Okay, thank you for your help.', cn: '好的，谢谢你的帮助。', words: ['help'] }
    ]
  },

  'listen-08': {
    id: 'listen-08', scene: 'pharmacy', title: '药店买感冒药', icon: '药', day: 8,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good afternoon. I think I have a cold.', cn: '下午好，我好像感冒了。', words: ['cold'] },
      { en: 'I\'m sorry to hear that. What are your symptoms?', cn: '听您这么说我很遗憾。您有什么症状？', words: ['symptom'] },
      { en: 'I have a runny nose and a slight fever.', cn: '我流鼻涕，还有点发烧。', words: ['runny nose', 'fever'] },
      { en: 'How long have you felt this way?', cn: '这样多久了？', words: ['felt'] },
      { en: 'Since yesterday evening.', cn: '从昨天晚上开始。', words: ['since'] },
      { en: 'Do you have any allergies to medicine?', cn: '您对什么药物过敏吗？', words: ['allergy'] },
      { en: 'No, I don\'t think so.', cn: '应该没有。', words: [] },
      { en: 'This cold medicine should help. Take it twice a day.', cn: '这个感冒药会有帮助，一天吃两次。', words: ['medicine', 'twice'] },
      { en: 'Does it make you sleepy?', cn: '它会让人犯困吗？', words: ['sleepy'] },
      { en: 'Yes, it might. Don\'t drive after taking it.', cn: '可能会。吃完药后不要开车。', words: ['drive'] },
      { en: 'Understood. Thank you very much.', cn: '明白了，非常感谢。', words: ['understood'] }
    ]
  },

  'listen-09': {
    id: 'listen-09', scene: 'bank', title: '银行换外汇', icon: '汇', day: 9,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning. I\'d like to exchange some US dollars.', cn: '早上好，我想兑换一些美元。', words: ['exchange'] },
      { en: 'Certainly. How much would you like to change?', cn: '好的。您想兑换多少？', words: ['change'] },
      { en: 'Two hundred dollars, please.', cn: '两百美元。', words: ['hundred'] },
      { en: 'What is the exchange rate today?', cn: '今天的汇率是多少？', words: ['exchange rate'] },
      { en: 'One dollar is about seven yuan.', cn: '一美元大约兑换七元人民币。', words: ['yuan'] },
      { en: 'That\'s a bit lower than I expected.', cn: '比我预期的低了一点。', words: ['expected'] },
      { en: 'Yes, the rate changes every day. Would you still like to exchange?', cn: '是的，汇率每天都在变。您还要兑换吗？', words: ['changes'] },
      { en: 'Yes, please. Here is the cash.', cn: '要的，这是现金。', words: ['cash'] },
      { en: 'Could I see your passport for the record?', cn: '能看一下您的护照做个登记吗？', words: ['record'] },
      { en: 'Sure. Here it is.', cn: '好的，给您。', words: [] },
      { en: 'Here is your money and the receipt. Please check.', cn: '这是您的钱和小票，请核对一下。', words: ['receipt'] }
    ]
  },

  'listen-10': {
    id: 'listen-10', scene: 'barber', title: '理发店沟通', icon: '理', day: 10,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good afternoon. I have a 3 o\'clock appointment.', cn: '下午好，我预约了 3 点。', words: ['appointment'] },
      { en: 'Ah yes, you must be Mr. Chen. Please have a seat.', cn: '啊，您一定是陈先生，请坐。', words: ['have a seat'] },
      { en: 'I\'d like a haircut, not too short.', cn: '我想剪个头发，不要太短。', words: ['haircut'] },
      { en: 'How short would you like it?', cn: '您想剪多短？', words: ['short'] },
      { en: 'Just take off about two centimeters.', cn: '剪掉大概两厘米就行。', words: ['centimeter'] },
      { en: 'Should I keep the sides short as well?', cn: '两边也剪短吗？', words: ['sides'] },
      { en: 'Yes, but please leave the top a little longer.', cn: '剪短，但头顶留长一点。', words: ['top'] },
      { en: 'Would you like a shampoo first?', cn: '要先洗个头吗？', words: ['shampoo'] },
      { en: 'No, thank you. Just a trim today.', cn: '不用了，谢谢。今天只修一修。', words: ['trim'] },
      { en: 'Okay. Is this length okay?', cn: '好的。这个长度可以吗？', words: ['length'] },
      { en: 'Perfect. That\'s exactly what I wanted.', cn: '完美，正是我想要的效果。', words: ['exactly'] }
    ]
  },

  'listen-11': {
    id: 'listen-11', scene: 'laundry', title: '洗衣店取衣服', icon: '洗', day: 11,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hi, I\'m here to pick up my laundry.', cn: '你好，我来取洗好的衣服。', words: ['pick up', 'laundry'] },
      { en: 'What name is it under?', cn: '登记的是什么名字？', words: ['name'] },
      { en: 'Zhang Wei. I dropped it off two days ago.', cn: '张伟，我两天前送来的。', words: ['drop off'] },
      { en: 'Let me check. Two shirts and a coat, is that right?', cn: '我查一下。两件衬衫和一件外套，对吗？', words: ['shirt', 'coat'] },
      { en: 'Yes, exactly. How much is it?', cn: '对，多少钱？', words: ['exactly'] },
      { en: 'That will be eighteen dollars in total.', cn: '一共 18 美元。', words: ['in total'] },
      { en: 'Here you go.', cn: '给你。', words: [] },
      { en: 'Thank you. One of your shirts had a button missing.', cn: '谢谢。您有一件衬衫掉了个扣子。', words: ['button', 'missing'] },
      { en: 'Oh really? Did you fix it?', cn: '是吗？你们修好了吗？', words: ['fix'] },
      { en: 'Yes, we replaced it for free.', cn: '是的，我们免费换了一个。', words: ['replace', 'for free'] },
      { en: 'That\'s very kind of you. Thank you!', cn: '你们太好了，谢谢！', words: ['kind'] }
    ]
  },

  'listen-12': {
    id: 'listen-12', scene: 'cafe', title: '咖啡店点单', icon: '咖', day: 12,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning! What can I get you?', cn: '早上好！您要点什么？', words: ['get you'] },
      { en: 'I\'d like a large latte, please.', cn: '我要一杯大杯拿铁。', words: ['latte'] },
      { en: 'Hot or iced?', cn: '热的还是冰的？', words: ['iced'] },
      { en: 'Hot, please. With oat milk if you have it.', cn: '热的，如果有燕麦奶的话就加燕麦奶。', words: ['oat milk'] },
      { en: 'We do. Anything to eat?', cn: '我们有。要吃点东西吗？', words: ['eat'] },
      { en: 'A blueberry muffin, please.', cn: '一个蓝莓松饼。', words: ['blueberry', 'muffin'] },
      { en: 'Would you like it warmed up?', cn: '要加热吗？', words: ['warmed up'] },
      { en: 'Yes, please. And could I get it for here?', cn: '好的。还有，能在这儿堂食吗？', words: ['for here'] },
      { en: 'Of course. That\'s nine fifty in total.', cn: '当然可以。一共 9.5 美元。', words: ['in total'] },
      { en: 'Here you go. Keep the change.', cn: '给你，不用找零了。', words: ['keep the change'] },
      { en: 'Thank you! Your order will be ready in a minute.', cn: '谢谢！您的订单马上就好。', words: ['order', 'ready'] }
    ]
  },

  'listen-13': {
    id: 'listen-13', scene: 'metro', title: '地铁换乘', icon: '铁', day: 13,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Excuse me, which line goes to the airport?', cn: '打扰一下，去机场坐哪条线？', words: ['line'] },
      { en: 'You need Line 2, then transfer to the airport express.', cn: '您坐 2 号线，然后换乘机场快线。', words: ['transfer', 'express'] },
      { en: 'Where should I transfer?', cn: '在哪里换乘？', words: ['transfer'] },
      { en: 'Get off at Central Station and follow the signs.', cn: '在中央车站下车，然后跟着指示牌走。', words: ['get off', 'sign'] },
      { en: 'How many stops is Central Station from here?', cn: '从这里到中央车站有几站？', words: ['stop'] },
      { en: 'It\'s the fifth stop.', cn: '第五站。', words: ['fifth'] },
      { en: 'Is the transfer easy to find?', cn: '换乘好找吗？', words: ['easy'] },
      { en: 'Yes, the signs are in English and Chinese.', cn: '好找，指示牌有英文和中文。', words: ['English', 'Chinese'] },
      { en: 'How long is the whole trip?', cn: '全程要多久？', words: ['whole trip'] },
      { en: 'About forty minutes.', cn: '大约四十分钟。', words: ['minute'] },
      { en: 'What\'s the fare?', cn: '车费是多少？', words: ['fare'] },
      { en: 'About four dollars with a travel card.', cn: '用交通卡的话大约 4 美元。', words: ['travel card'] }
    ]
  },

  'listen-14': {
    id: 'listen-14', scene: 'museum', title: '博物馆导览', icon: '博', day: 14,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Welcome to the city museum. Are you here for the tour?', cn: '欢迎来到市博物馆。您是来参加导览的吗？', words: ['museum', 'tour'] },
      { en: 'Yes, when does the English tour start?', cn: '是的，英文导览什么时候开始？', words: ['start'] },
      { en: 'It starts at 10:30, in about ten minutes.', cn: '10 点 30 分开始，大约十分钟后。', words: ['about'] },
      { en: 'How long does it last?', cn: '导览持续多久？', words: ['last'] },
      { en: 'About an hour and a half.', cn: '大约一个半小时。', words: ['hour and a half'] },
      { en: 'Can we take photos inside?', cn: '里面可以拍照吗？', words: ['take photos'] },
      { en: 'Yes, but no flash in the painting hall.', cn: '可以，但绘画厅里不能用闪光灯。', words: ['flash'] },
      { en: 'Is there a gift shop?', cn: '有礼品店吗？', words: ['gift shop'] },
      { en: 'Yes, it\'s on the first floor next to the exit.', cn: '有，在一楼出口旁边。', words: ['exit'] },
      { en: 'Do you offer audio guides in Chinese?', cn: '有中文语音导览吗？', words: ['audio guide'] },
      { en: 'Of course. You can rent one at the front desk.', cn: '有的，您可以在前台租一个。', words: ['rent', 'front desk'] }
    ]
  },

  'listen-15': {
    id: 'listen-15', scene: 'park', title: '公园晨跑问路', icon: '园', day: 15,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning! Is this the jogging trail?', cn: '早上好！这是跑步道吗？', words: ['jogging', 'trail'] },
      { en: 'Yes, it goes around the whole lake.', cn: '是的，这条道绕着整个湖。', words: ['around', 'lake'] },
      { en: 'How long is the full loop?', cn: '一圈有多长？', words: ['loop'] },
      { en: 'About three kilometers.', cn: '大约三公里。', words: ['kilometer'] },
      { en: 'Is it flat or hilly?', cn: '是平地还是有坡？', words: ['flat', 'hilly'] },
      { en: 'Mostly flat, with a few gentle slopes.', cn: '大部分是平地，只有几处缓坡。', words: ['gentle slopes'] },
      { en: 'Perfect. Is there a water fountain along the way?', cn: '太好了。路上有饮水处吗？', words: ['water fountain'] },
      { en: 'Yes, there are two, at the north and south ends.', cn: '有的，南北两端各有一个。', words: ['north', 'south'] },
      { en: 'What time does the park close?', cn: '公园几点关门？', words: ['close'] },
      { en: 'It stays open until ten at night.', cn: '一直开到晚上十点。', words: ['until'] },
      { en: 'Is the trail well lit at night?', cn: '晚上步道照明好吗？', words: ['lit'] },
      { en: 'Yes, there are lights along the path.', cn: '好，沿途都有路灯。', words: ['light'] }
    ]
  },

  'listen-16': {
    id: 'listen-16', scene: 'vet', title: '宠物医院就诊', icon: '宠', day: 16,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hello, I\'d like to have my dog checked.', cn: '你好，我想给狗狗做个检查。', words: ['checked'] },
      { en: 'What seems to be the problem?', cn: '它怎么了？', words: ['problem'] },
      { en: 'He hasn\'t eaten well for two days.', cn: '它两天没好好吃东西了。', words: ['eaten'] },
      { en: 'Let me take a look. Is he drinking water?', cn: '让我看看。它有喝水吗？', words: ['drinking'] },
      { en: 'Yes, but not much.', cn: '有，但喝得不多。', words: ['not much'] },
      { en: 'His temperature is a little high.', cn: '它的体温有点高。', words: ['temperature'] },
      { en: 'Is it serious?', cn: '严重吗？', words: ['serious'] },
      { en: 'Probably just a mild infection. I\'ll give him some medicine.', cn: '可能只是轻微感染。我会给它开点药。', words: ['mild infection'] },
      { en: 'How should I give it to him?', cn: '怎么给它喂药？', words: ['give'] },
      { en: 'Mix it with his food twice a day.', cn: '一天两次，混在它的食物里。', words: ['mix', 'twice'] },
      { en: 'When should I bring him back?', cn: '什么时候再带它来复查？', words: ['bring back'] },
      { en: 'If he\'s not better in three days, bring him back.', cn: '如果三天后还不好，就带它回来。', words: ['better'] }
    ]
  },

  'listen-17': {
    id: 'listen-17', scene: 'card', title: '信用卡挂失', icon: '卡', day: 17,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning. I need to report a lost credit card.', cn: '早上好，我要挂失一张信用卡。', words: ['report', 'lost'] },
      { en: 'I\'m sorry to hear that. What\'s your card number?', cn: '很遗憾听到这个消息。您的卡号是多少？', words: ['card number'] },
      { en: 'I don\'t remember it. My name is on the card.', cn: '我不记得了，卡上有我的名字。', words: ['remember'] },
      { en: 'No problem. Let me find your account with your ID.', cn: '没关系，我用您的证件查一下账户。', words: ['account', 'ID'] },
      { en: 'Here is my passport.', cn: '这是我的护照。', words: ['passport'] },
      { en: 'Thank you. I\'ve found your account.', cn: '谢谢，我找到您的账户了。', words: ['found'] },
      { en: 'Could you cancel the card right away?', cn: '能马上冻结这张卡吗？', words: ['cancel', 'right away'] },
      { en: 'Done. Your card is now frozen.', cn: '办好了，您的卡现在已冻结。', words: ['frozen'] },
      { en: 'What if someone already used it?', cn: '如果有人已经刷了怎么办？', words: ['used'] },
      { en: 'Don\'t worry, we\'ll check and refund any suspicious charges.', cn: '别担心，我们会核查并退还任何可疑交易。', words: ['refund', 'suspicious'] },
      { en: 'I\'m so relieved. Thank you!', cn: '那我就放心了，谢谢！', words: ['relieved'] }
    ]
  },

  'listen-18': {
    id: 'listen-18', scene: 'car-rental', title: '租车还车', icon: '租', day: 18,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hello, I\'m returning my rental car.', cn: '你好，我来还租的车。', words: ['returning', 'rental'] },
      { en: 'Great. Do you have the rental agreement?', cn: '好的。您带租车协议了吗？', words: ['agreement'] },
      { en: 'Yes, here it is. The car was rented for three days.', cn: '带了，给您。车租了三天。', words: ['rented'] },
      { en: 'Let me check the car for any damage.', cn: '让我检查一下车有没有损伤。', words: ['damage'] },
      { en: 'Sure, take your time.', cn: '好的，慢慢来。', words: ['take your time'] },
      { en: 'The car looks good. How many kilometers did you drive?', cn: '车况不错。您开了多少公里？', words: ['drive'] },
      { en: 'About four hundred.', cn: '大约四百公里。', words: ['hundred'] },
      { en: 'Perfect, that\'s within the limit.', cn: '很好，在限额以内。', words: ['within the limit'] },
      { en: 'Do I owe anything extra?', cn: '我需要额外付钱吗？', words: ['owe', 'extra'] },
      { en: 'No, the fuel is full, so no extra charge.', cn: '不用，油是满的，所以没有额外费用。', words: ['fuel', 'charge'] },
      { en: 'Can you send me the final receipt by email?', cn: '能把最终收据发到我邮箱吗？', words: ['receipt', 'email'] },
      { en: 'Of course. Check your inbox later today.', cn: '当然，今天晚些时候查收您的邮箱。', words: ['inbox'] }
    ]
  },

  'listen-19': {
    id: 'listen-19', scene: 'repair', title: '手机维修店', icon: '修', day: 19,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hi, my phone screen is cracked. Can you fix it?', cn: '你好，我的手机屏幕碎了，能修吗？', words: ['cracked', 'fix'] },
      { en: 'Let me see. Yes, we can replace the screen.', cn: '我看看。可以，我们能换屏。', words: ['replace'] },
      { en: 'How long will it take?', cn: '要多久？', words: ['take'] },
      { en: 'About an hour.', cn: '大约一个小时。', words: ['hour'] },
      { en: 'How much does it cost?', cn: '多少钱？', words: ['cost'] },
      { en: 'Eighty dollars for the screen replacement.', cn: '换屏 80 美元。', words: ['replacement'] },
      { en: 'That\'s a bit expensive. Is there a cheaper option?', cn: '有点贵，有便宜点的选择吗？', words: ['expensive', 'cheaper'] },
      { en: 'That\'s the standard price for this model.', cn: '这是这款手机的标准价格。', words: ['standard', 'model'] },
      { en: 'Okay, I\'ll do it. Please back up my data first.', cn: '好吧，那就修吧。请先备份我的数据。', words: ['back up', 'data'] },
      { en: 'Don\'t worry, replacing the screen won\'t affect your data.', cn: '别担心，换屏不影响您的数据。', words: ['affect'] },
      { en: 'Great. I\'ll come back in an hour.', cn: '太好了，我一小时后来取。', words: ['come back'] }
    ]
  },

  'listen-20': {
    id: 'listen-20', scene: 'bill', title: '餐厅 AA 结账', icon: '单', day: 20,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Could we have the check, please?', cn: '请给我们结账。', words: ['check'] },
      { en: 'Sure. Here you are.', cn: '好的，给您。', words: [] },
      { en: 'Let me see. We\'ll split the bill evenly.', cn: '我看看。我们平摊账单吧。', words: ['split', 'evenly'] },
      { en: 'Actually, I had the expensive steak, so I\'ll pay more.', cn: '其实我点了贵的牛排，我多出点吧。', words: ['expensive'] },
      { en: 'Don\'t worry about it. Let\'s just split it half and half.', cn: '别在意，我们一人一半就好。', words: ['half and half'] },
      { en: 'Are you sure?', cn: '你确定吗？', words: ['sure'] },
      { en: 'Yes, we\'re friends. It\'s fine.', cn: '确定，我们是朋友嘛，没关系的。', words: ['friends'] },
      { en: 'Okay, thanks. How much is my half?', cn: '好吧，谢谢。我那一半是多少？', words: ['half'] },
      { en: 'The total is sixty dollars, so thirty each.', cn: '总共 60 美元，每人 30。', words: ['total'] },
      { en: 'Plus the tip, maybe thirty-five?', cn: '加上小费，每人 35 吧？', words: ['tip'] },
      { en: 'Good idea. Let\'s leave a ten percent tip.', cn: '好主意，就留 10% 的小费。', words: ['percent'] },
      { en: 'Done. Let\'s head out.', cn: '搞定，走吧。', words: ['head out'] }
    ]
  },

  'listen-21': {
    id: 'listen-21', scene: 'gym', title: '健身房办卡', icon: '健', day: 21,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hi, I\'m interested in joining the gym.', cn: '你好，我想办健身卡。', words: ['joining', 'gym'] },
      { en: 'Great choice! We have monthly and yearly plans.', cn: '好选择！我们有月卡和年卡。', words: ['monthly', 'yearly'] },
      { en: 'How much is the monthly plan?', cn: '月卡多少钱？', words: ['monthly plan'] },
      { en: 'It\'s forty dollars a month, or three hundred for a year.', cn: '每月 40 美元，年卡 300 美元。', words: ['plan'] },
      { en: 'Are the classes included?', cn: '课程包含在内吗？', words: ['class', 'included'] },
      { en: 'Yes, all group classes are free for members.', cn: '包含，会员可以免费上所有团体课。', words: ['group class', 'free'] },
      { en: 'What time does the gym open?', cn: '健身房几点开门？', words: ['open'] },
      { en: 'We\'re open from six in the morning to eleven at night.', cn: '早上 6 点开到晚上 11 点。', words: ['from', 'to'] },
      { en: 'Is there a personal trainer available?', cn: '有私人教练吗？', words: ['personal trainer'] },
      { en: 'Yes, you can book a session at the front desk.', cn: '有，您可以在前台预约课程。', words: ['book', 'session'] },
      { en: 'I\'ll take the yearly plan.', cn: '那我办年卡。', words: ['take'] },
      { en: 'Wonderful. Let me set up your membership card.', cn: '太好了，我来给您办会员卡。', words: ['membership'] }
    ]
  },

  'listen-22': {
    id: 'listen-22', scene: 'supermarket', title: '超市退换货', icon: '退', day: 22,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Excuse me, I\'d like to return this sweater.', cn: '打扰一下，我想退这件毛衣。', words: ['return', 'sweater'] },
      { en: 'What\'s wrong with it?', cn: '它怎么了？', words: ['wrong'] },
      { en: 'It\'s too small. I bought the wrong size.', cn: '太小了，我买错尺寸了。', words: ['size'] },
      { en: 'Do you have the receipt?', cn: '您有小票吗？', words: ['receipt'] },
      { en: 'Yes, here it is.', cn: '有，给您。', words: [] },
      { en: 'I\'m sorry, but this was on sale.', cn: '抱歉，这件商品是特价品。', words: ['on sale'] },
      { en: 'So I can\'t return it?', cn: '那不能退了吗？', words: ['return'] },
      { en: 'You can exchange it for another size if we have it.', cn: '如果有其他尺码，您可以换一件。', words: ['exchange'] },
      { en: 'Do you have a medium in stock?', cn: '有中码的库存吗？', words: ['medium', 'in stock'] },
      { en: 'Let me check. Yes, we do.', cn: '我查一下。有的。', words: ['check'] },
      { en: 'Perfect. I\'ll take the medium instead.', cn: '太好了，那我换中码。', words: ['instead'] },
      { en: 'Great. Let me process the exchange for you.', cn: '好的，我来为您办理换货。', words: ['process'] }
    ]
  },

  'listen-23': {
    id: 'listen-23', scene: 'post', title: '邮局寄包裹', icon: '邮', day: 23,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hello, I\'d like to send this package to China.', cn: '你好，我想把这个包裹寄到中国。', words: ['package'] },
      { en: 'Certainly. What\'s inside?', cn: '好的，里面是什么？', words: ['inside'] },
      { en: 'Just some books and clothes.', cn: '只是一些书和衣服。', words: ['books', 'clothes'] },
      { en: 'Would you like to send it by air or sea?', cn: '您想寄空运还是海运？', words: ['by air', 'by sea'] },
      { en: 'How long does air mail take?', cn: '空运要多久？', words: ['air mail'] },
      { en: 'About a week. Sea mail takes a month.', cn: '大约一周。海运要一个月。', words: ['week', 'month'] },
      { en: 'I\'ll send it by air, then.', cn: '那就寄空运吧。', words: ['by air'] },
      { en: 'Let me weigh it. That\'s two point five kilos.', cn: '我称一下。2.5 公斤。', words: ['weigh', 'kilo'] },
      { en: 'How much is the postage?', cn: '邮费多少？', words: ['postage'] },
      { en: 'It\'s twenty-eight dollars with tracking.', cn: '带追踪 28 美元。', words: ['tracking'] },
      { en: 'Okay, that\'s fine. I\'ll take it.', cn: '好的，可以，就寄这个。', words: ['fine'] }
    ]
  },

  'listen-24': {
    id: 'listen-24', scene: 'theater', title: '剧院订票', icon: '剧', day: 24,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good evening. Do you have tickets for tonight\'s show?', cn: '晚上好，还有今晚演出的票吗？', words: ['ticket', 'show'] },
      { en: 'Yes, we still have some seats in the balcony.', cn: '有的，楼座还有一些位置。', words: ['balcony'] },
      { en: 'How much are they?', cn: '多少钱一张？', words: ['how much'] },
      { en: 'Thirty dollars each.', cn: '每张 30 美元。', words: ['each'] },
      { en: 'Could I get two tickets in the middle section?', cn: '能给我两张中间区域的票吗？', words: ['middle section'] },
      { en: 'Let me check. Yes, seats B12 and B13 are available.', cn: '我查一下。有，B12 和 B13 座可以。', words: ['available'] },
      { en: 'Great, I\'ll take them.', cn: '太好了，我就要这两张。', words: ['take'] },
      { en: 'That\'s sixty dollars. Cash or card?', cn: '一共 60 美元。现金还是刷卡？', words: ['cash', 'card'] },
      { en: 'Card, please.', cn: '刷卡。', words: ['card'] },
      { en: 'Here are your tickets. The show starts at eight.', cn: '这是您的票。演出 8 点开始。', words: ['starts'] },
      { en: 'Perfect, thank you!', cn: '太好了，谢谢！', words: ['perfect'] }
    ]
  },

  'listen-25': {
    id: 'listen-25', scene: 'visa', title: '签证面试', icon: '签', day: 25,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning. Please state the purpose of your visit.', cn: '早上好。请说明您此行的目的。', words: ['state', 'purpose'] },
      { en: 'I\'d like to visit my daughter who studies here.', cn: '我想看望在这里读书的女儿。', words: ['visit', 'studies'] },
      { en: 'How long do you plan to stay?', cn: '您计划待多久？', words: ['plan to stay'] },
      { en: 'About three weeks.', cn: '大约三周。', words: ['weeks'] },
      { en: 'Do you have a return ticket?', cn: '您有返程机票吗？', words: ['return ticket'] },
      { en: 'Yes, here is my booking confirmation.', cn: '有，这是我的订票确认单。', words: ['booking', 'confirmation'] },
      { en: 'What does your daughter do here?', cn: '您女儿在这里做什么？', words: ['daughter'] },
      { en: 'She\'s a graduate student at the university.', cn: '她是大学的研究生。', words: ['graduate student'] },
      { en: 'How will you support your stay?', cn: '您在国外的开销怎么保障？', words: ['support'] },
      { en: 'I have enough savings, and she will host me.', cn: '我有足够的存款，而且她可以接待我。', words: ['savings', 'host'] },
      { en: 'That\'s fine. Your visa is approved.', cn: '好的，您的签证通过了。', words: ['approved'] },
      { en: 'Really? Thank you so much!', cn: '真的吗？太感谢了！', words: ['thank you'] }
    ]
  },

  'listen-26': {
    id: 'listen-26', scene: 'doctor', title: '复诊预约', icon: '医', day: 26,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Hello, I\'d like to make a follow-up appointment.', cn: '你好，我想预约复诊。', words: ['follow-up', 'appointment'] },
      { en: 'Sure. When was your last visit?', cn: '好的。您上次就诊是什么时候？', words: ['last visit'] },
      { en: 'Two weeks ago, for my blood pressure.', cn: '两周前，为了血压的问题。', words: ['blood pressure'] },
      { en: 'Would Thursday morning work for you?', cn: '周四上午可以吗？', words: ['Thursday'] },
      { en: 'Yes, that\'s perfect.', cn: '可以，非常好。', words: ['perfect'] },
      { en: 'At 10:30 with Dr. Smith?', cn: '10 点 30 分，史密斯医生，可以吗？', words: ['doctor'] },
      { en: 'That works. Do I need to fast before the test?', cn: '可以。检查前需要空腹吗？', words: ['fast'] },
      { en: 'No, this time it\'s just a regular check-up.', cn: '不用，这次只是常规检查。', words: ['regular check-up'] },
      { en: 'Should I bring anything?', cn: '我需要带什么吗？', words: ['bring'] },
      { en: 'Just your medical records and insurance card.', cn: '带上病历和保险卡就行。', words: ['medical records', 'insurance'] },
      { en: 'Got it. See you Thursday.', cn: '明白了。周四见。', words: ['see you'] }
    ]
  },

  'listen-27': {
    id: 'listen-27', scene: 'hotel', title: '叫醒服务', icon: '醒', day: 27,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Front desk, how can I help you?', cn: '这里是前台，有什么可以帮您？', words: ['front desk'] },
      { en: 'Could I request a wake-up call for tomorrow?', cn: '能帮我安排明早的叫醒电话吗？', words: ['wake-up call'] },
      { en: 'Certainly. What time would you like?', cn: '当然可以。您想几点被叫醒？', words: ['what time'] },
      { en: 'At 5:30 in the morning, please.', cn: '早上 5 点 30 分。', words: ['morning'] },
      { en: 'Would you like one call or two?', cn: '打一次还是两次？', words: ['one or two'] },
      { en: 'Two calls, ten minutes apart, in case I sleep through.', cn: '两次，间隔十分钟，以防我睡过头。', words: ['apart', 'sleep through'] },
      { en: 'No problem. We\'ll call you at 5:30 and 5:40.', cn: '没问题。我们会在 5 点 30 和 5 点 40 给您打电话。', words: ['call'] },
      { en: 'Also, could you arrange a taxi to the airport?', cn: '另外，能帮我安排去机场的出租车吗？', words: ['arrange', 'taxi'] },
      { en: 'Sure. What time do you need it?', cn: '好的，您几点需要？', words: ['need'] },
      { en: 'Around 6:15, please.', cn: '大约 6 点 15 分。', words: ['around'] },
      { en: 'Done. Anything else?', cn: '安排好了。还有其他需要吗？', words: ['anything else'] },
      { en: 'No, that\'s all. Good night!', cn: '没有了，就这些。晚安！', words: ['good night'] }
    ]
  },

  'listen-28': {
    id: 'listen-28', scene: 'beach', title: '海边度假安排', icon: '滩', day: 28,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'This beach is beautiful! What should we do first?', cn: '这片海滩真美！我们先做什么？', words: ['beach', 'beautiful'] },
      { en: 'Let\'s rent an umbrella and some chairs.', cn: '我们先租把伞和几把椅子吧。', words: ['rent', 'umbrella'] },
      { en: 'How much does it cost?', cn: '要多少钱？', words: ['cost'] },
      { en: 'About ten dollars for the whole day.', cn: '一整天大约 10 美元。', words: ['whole day'] },
      { en: 'Can we take a boat ride later?', cn: '待会儿能坐船吗？', words: ['boat ride'] },
      { en: 'Yes, the boat tours leave every hour.', cn: '可以，游船每小时一班。', words: ['tour', 'hour'] },
      { en: 'How long is the tour?', cn: '游船要多久？', words: ['tour'] },
      { en: 'About forty minutes.', cn: '大约四十分钟。', words: ['minutes'] },
      { en: 'Is swimming safe here today?', cn: '今天在这里游泳安全吗？', words: ['swimming', 'safe'] },
      { en: 'Yes, the lifeguards say the water is calm.', cn: '安全，救生员说今天水面平静。', words: ['lifeguard', 'calm'] },
      { en: 'Great. What time is sunset?', cn: '太好了。几点日落？', words: ['sunset'] },
      { en: 'Around 6:45. Perfect for photos.', cn: '大约 6 点 45 分，非常适合拍照。', words: ['photos'] }
    ]
  },

  'listen-29': {
    id: 'listen-29', scene: 'tax-refund', title: '商场购物退税', icon: '税', day: 29,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Excuse me, is this the tax refund counter?', cn: '打扰一下，这里是退税柜台吗？', words: ['tax refund', 'counter'] },
      { en: 'Yes, it is. May I see your receipts and passport?', cn: '是的。请出示您的购物小票和护照。', words: ['receipt', 'passport'] },
      { en: 'Here you go. I bought these at two stores.', cn: '给您。我在两家店买了这些东西。', words: ['stores'] },
      { en: 'Let me check. Both are over the minimum amount.', cn: '我核对一下。两笔都超过了最低金额。', words: ['minimum amount'] },
      { en: 'How will I receive the refund?', cn: '我怎样才能收到退税？', words: ['refund'] },
      { en: 'We can send it to your card or give you cash.', cn: '我们可以退到您的卡上，或者给您现金。', words: ['card', 'cash'] },
      { en: 'Card, please.', cn: '退到卡上吧。', words: ['card'] },
      { en: 'Fill in this form with your card number.', cn: '请填一下这张表，写上卡号。', words: ['form', 'number'] },
      { en: 'Okay, done.', cn: '好的，填好了。', words: ['done'] },
      { en: 'Your refund will arrive within two weeks.', cn: '您的退税款会在两周内到账。', words: ['within', 'weeks'] },
      { en: 'Thank you very much!', cn: '非常感谢！', words: ['thank you'] }
    ]
  },

  'listen-30': {
    id: 'listen-30', scene: 'airport', title: '回国航班确认', icon: '航', day: 30,
    duration: '8-12分钟', level: 1,
    dialogue: [
      { en: 'Good morning, I\'d like to confirm my flight tomorrow.', cn: '早上好，我想确认一下明天的航班。', words: ['confirm', 'flight'] },
      { en: 'What\'s your flight number?', cn: '您的航班号是多少？', words: ['flight number'] },
      { en: 'CA982, to Beijing.', cn: 'CA982，飞往北京。', words: ['Beijing'] },
      { en: 'Yes, I see it. Departure is at 9:40 AM.', cn: '查到了。起飞时间是上午 9 点 40 分。', words: ['departure'] },
      { en: 'What time should I be at the airport?', cn: '我该几点到机场？', words: ['airport'] },
      { en: 'Please arrive two hours before departure.', cn: '请在起飞前两小时到达。', words: ['arrive', 'before'] },
      { en: 'Which terminal is it?', cn: '在哪个航站楼？', words: ['terminal'] },
      { en: 'Terminal 1, check-in counters A.', cn: '1 号航站楼，A 值机柜台。', words: ['terminal', 'check-in'] },
      { en: 'Is there a direct train to the airport?', cn: '有直达机场的火车吗？', words: ['direct train'] },
      { en: 'Yes, the express train takes about thirty minutes.', cn: '有，快车大约 30 分钟。', words: ['express train'] },
      { en: 'Perfect. Thank you for your help.', cn: '太好了，谢谢您的帮助。', words: ['help'] },
      { en: 'You\'re welcome. Have a safe trip home!', cn: '不客气，祝您一路平安！', words: ['safe trip'] }
    ]
  }
};
