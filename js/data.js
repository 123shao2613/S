/**
 * S - Korean Learning Workbench
 * Data Layer: All learning content data
 */

const S_DATA = {

  // ========================================
  // 1. PHONICS - 40 Korean Letters
  // ========================================
  phonics: {
    consonants: [
      { letter: 'ㄱ', name: '기역', roman: 'g/k', sound: '松音，类似汉语 g 但气流较弱', type: 'basic', example: '가', exampleRoman: 'ga', exampleMeaning: '边', mouth: 'tongue-back-up', desc: '舌根抬起接近软腭，气流摩擦而出' },
      { letter: 'ㄴ', name: '니은', roman: 'n', sound: '鼻音，与汉语 n 相同', type: 'basic', example: '나', exampleRoman: 'na', exampleMeaning: '我', mouth: 'tongue-tip-up', desc: '舌尖抵住上齿龈，气流从鼻腔通过' },
      { letter: 'ㄷ', name: '디귿', roman: 'd/t', sound: '松音，类似汉语 d 但气流较弱', type: 'basic', example: '다', exampleRoman: 'da', exampleMeaning: '全部', mouth: 'tongue-tip-up', desc: '舌尖抵住上齿龈，气流冲开阻碍' },
      { letter: 'ㄹ', name: '리을', roman: 'r/l', sound: '闪音，介于 r 和 l 之间', type: 'basic', example: '라', exampleRoman: 'ra', exampleMeaning: '拉', mouth: 'tongue-tip-flap', desc: '舌尖轻弹上齿龈一次，类似弹舌' },
      { letter: 'ㅁ', name: '미음', roman: 'm', sound: '鼻音，与汉语 m 相同', type: 'basic', example: '마', exampleRoman: 'ma', exampleMeaning: '马', mouth: 'lips-closed', desc: '双唇紧闭，气流从鼻腔通过' },
      { letter: 'ㅂ', name: '비읍', roman: 'b/p', sound: '松音，类似汉语 b 但气流较弱', type: 'basic', example: '바', exampleRoman: 'ba', exampleMeaning: '吧', mouth: 'lips-closed', desc: '双唇紧闭，气流冲开双唇' },
      { letter: 'ㅅ', name: '시옷', roman: 's', sound: '松音，类似汉语 s', type: 'basic', example: '사', exampleRoman: 'sa', exampleMeaning: '四', mouth: 'teeth-narrow', desc: '舌尖靠近上齿龈，气流摩擦而出' },
      { letter: 'ㅇ', name: '이응', roman: 'ng', sound: '首音不发音，尾音发 ng', type: 'basic', example: '아', exampleRoman: 'a', exampleMeaning: '啊', mouth: 'throat-open', desc: '词首不发音，词末发后鼻音 ng' },
      { letter: 'ㅈ', name: '지읒', roman: 'j', sound: '松音，类似汉语 z/j 之间', type: 'basic', example: '자', exampleRoman: 'ja', exampleMeaning: '尺', mouth: 'tongue-tip-up', desc: '舌尖抵住上齿龈，气流摩擦破阻' },
      { letter: 'ㅊ', name: '치읓', roman: 'ch', sound: '送气音，类似汉语 ch', type: 'basic', example: '차', exampleRoman: 'cha', exampleMeaning: '茶', mouth: 'tongue-tip-up-strong', desc: '与ㅈ相同位置，但送气强烈' },
      { letter: 'ㅋ', name: '키읔', roman: 'k', sound: '送气音，类似汉语 k', type: 'basic', example: '카', exampleRoman: 'ka', exampleMeaning: '卡', mouth: 'tongue-back-up-strong', desc: '与ㄱ相同位置，但送气强烈' },
      { letter: 'ㅌ', name: '티읕', roman: 't', sound: '送气音，类似汉语 t', type: 'basic', example: '타', exampleRoman: 'ta', exampleMeaning: '打', mouth: 'tongue-tip-up-strong', desc: '与ㄷ相同位置，但送气强烈' },
      { letter: 'ㅍ', name: '피읖', roman: 'p', sound: '送气音，类似汉语 p', type: 'basic', example: '파', exampleRoman: 'pa', exampleMeaning: '葱', mouth: 'lips-closed-strong', desc: '与ㅂ相同位置，但送气强烈' },
      { letter: 'ㅎ', name: '히읗', roman: 'h', sound: '喉音，类似汉语 h', type: 'basic', example: '하', exampleRoman: 'ha', exampleMeaning: '做', mouth: 'throat-open', desc: '气流从喉咙深处摩擦而出' },
      { letter: 'ㄲ', name: '쌍기역', roman: 'kk', sound: '紧音，ㄱ的紧音版本', type: 'tense', example: '까', exampleRoman: 'kka', exampleMeaning: '（拟声）', mouth: 'tongue-back-up-tense', desc: '与ㄱ相同位置，但声门紧闭后释放' },
      { letter: 'ㄸ', name: '쌍디귿', roman: 'tt', sound: '紧音，ㄷ的紧音版本', type: 'tense', example: '따', exampleRoman: 'tta', exampleMeaning: '（拟声）', mouth: 'tongue-tip-up-tense', desc: '与ㄷ相同位置，但声门紧闭后释放' },
      { letter: 'ㅃ', name: '쌍비읍', roman: 'pp', sound: '紧音，ㅂ的紧音版本', type: 'tense', example: '빠', exampleRoman: 'ppa', exampleMeaning: '（拟声）', mouth: 'lips-closed-tense', desc: '与ㅂ相同位置，但声门紧闭后释放' },
      { letter: 'ㅆ', name: '쌍시옷', roman: 'ss', sound: '紧音，ㅅ的紧音版本', type: 'tense', example: '싸', exampleRoman: 'ssa', exampleMeaning: '便宜', mouth: 'teeth-narrow-tense', desc: '与ㅅ相同位置，但声门紧闭后释放' },
      { letter: 'ㅉ', name: '쌍지읒', roman: 'jj', sound: '紧音，ㅈ的紧音版本', type: 'tense', example: '짜', exampleRoman: 'jja', exampleMeaning: '咸', mouth: 'tongue-tip-up-tense', desc: '与ㅈ相同位置，但声门紧闭后释放' },
    ],
    vowels: [
      { letter: 'ㅏ', roman: 'a', sound: '开口音，类似汉语 a', type: 'basic', example: '아', exampleRoman: 'a', exampleMeaning: '啊', mouth: 'mouth-open-wide', desc: '口自然张开，舌头放平' },
      { letter: 'ㅑ', roman: 'ya', sound: '半开音，类似汉语 ya', type: 'basic', example: '야', exampleRoman: 'ya', exampleMeaning: '呀', mouth: 'mouth-open-wide', desc: '先发 i 再滑向 a' },
      { letter: 'ㅓ', roman: 'eo', sound: '半开音，类似汉语 o 但嘴唇不圆', type: 'basic', example: '어', exampleRoman: 'eo', exampleMeaning: '语', mouth: 'mouth-half-open', desc: '口半开，舌根稍抬，嘴唇不圆' },
      { letter: 'ㅕ', roman: 'yeo', sound: '半开音，类似汉语 yo 但嘴唇不圆', type: 'basic', example: '여', exampleRoman: 'yeo', exampleMeaning: '与', mouth: 'mouth-half-open', desc: '先发 i 再滑向 eo' },
      { letter: 'ㅗ', roman: 'o', sound: '圆唇音，类似汉语 o', type: 'basic', example: '오', exampleRoman: 'o', exampleMeaning: '五', mouth: 'lips-round-small', desc: '口半开，双唇收圆' },
      { letter: 'ㅛ', roman: 'yo', sound: '圆唇音，类似汉语 yo', type: 'basic', example: '요', exampleRoman: 'yo', exampleMeaning: '要', mouth: 'lips-round-small', desc: '先发 i 再滑向 o' },
      { letter: 'ㅜ', roman: 'u', sound: '圆唇音，类似汉语 u', type: 'basic', example: '우', exampleRoman: 'u', exampleMeaning: '牛', mouth: 'lips-round-small', desc: '口微开，双唇收圆前突' },
      { letter: 'ㅠ', roman: 'yu', sound: '圆唇音，类似汉语 yu', type: 'basic', example: '유', exampleRoman: 'yu', exampleMeaning: '有', mouth: 'lips-round-small', desc: '先发 i 再滑向 u' },
      { letter: 'ㅡ', roman: 'eu', sound: '扁平音，汉语无对应', type: 'basic', example: '으', exampleRoman: 'eu', exampleMeaning: '（助词）', mouth: 'mouth-flat', desc: '口微开，嘴唇向两侧拉开，舌根稍抬' },
      { letter: 'ㅣ', roman: 'i', sound: '窄元音，类似汉语 i', type: 'basic', example: '이', exampleRoman: 'i', exampleMeaning: '牙', mouth: 'mouth-narrow', desc: '口微开，嘴角向两侧拉，舌前部抬起' },
      { letter: 'ㅐ', roman: 'ae', sound: '半开音，类似汉语 ai 的前半', type: 'compound', example: '애', exampleRoman: 'ae', exampleMeaning: '孩子', mouth: 'mouth-half-open', desc: '口半开，舌位介于 a 和 e 之间' },
      { letter: 'ㅒ', roman: 'yae', sound: '半开音，ㅐ的介音版', type: 'compound', example: '얘', exampleRoman: 'yae', exampleMeaning: '（口语）', mouth: 'mouth-half-open', desc: '先发 i 再滑向 ae' },
      { letter: 'ㅔ', roman: 'e', sound: '半开音，类似汉语 e', type: 'compound', example: '에', exampleRoman: 'e', exampleMeaning: '在（助词）', mouth: 'mouth-half-open', desc: '口半开，舌前部稍抬' },
      { letter: 'ㅖ', roman: 'ye', sound: '半开音，ㅔ的介音版', type: 'compound', example: '예', exampleRoman: 'ye', exampleMeaning: '礼', mouth: 'mouth-half-open', desc: '先发 i 再滑向 e' },
      { letter: 'ㅘ', roman: 'wa', sound: '复合元音，类似汉语 wa', type: 'compound', example: '와', exampleRoman: 'wa', exampleMeaning: '和', mouth: 'lips-round-small', desc: '先发 o 再滑向 a' },
      { letter: 'ㅙ', roman: 'wae', sound: '复合元音，类似汉语 wai', type: 'compound', example: '왜', exampleRoman: 'wae', exampleMeaning: '为什么', mouth: 'lips-round-small', desc: '先发 o 再滑向 ae' },
      { letter: 'ㅚ', roman: 'oe', sound: '复合元音，圆唇的 e', type: 'compound', example: '외', exampleRoman: 'oe', exampleMeaning: '外', mouth: 'lips-round-small', desc: '双唇收圆，舌位与 e 相似' },
      { letter: 'ㅝ', roman: 'wo', sound: '复合元音，类似汉语 wo', type: 'compound', example: '워', exampleRoman: 'wo', exampleMeaning: '（语尾）', mouth: 'lips-round-small', desc: '先发 u 再滑向 eo' },
      { letter: 'ㅞ', roman: 'we', sound: '复合元音，类似汉语 wei', type: 'compound', example: '웨', exampleRoman: 'we', exampleMeaning: '（外来词）', mouth: 'lips-round-small', desc: '先发 u 再滑向 e' },
      { letter: 'ㅟ', roman: 'wi', sound: '复合元音，圆唇的 i', type: 'compound', example: '위', exampleRoman: 'wi', exampleMeaning: '上面', mouth: 'lips-round-small', desc: '双唇收圆，舌位与 i 相似' },
      { letter: 'ㅢ', roman: 'ui', sound: '复合元音，eu+i', type: 'compound', example: '의', exampleRoman: 'ui', exampleMeaning: '的（助词）', mouth: 'mouth-flat', desc: '先发 eu 再滑向 i' },
    ]
  },

  // ========================================
  // 2. VOCABULARY - Daily Words by Level
  // ========================================
  vocabulary: {
    beginner: [
      { word: '안녕하세요', roman: 'annyeonghaseyo', meaning: '你好', sentence: '안녕하세요, 만나서 반갑습니다.', sentenceTr: '你好，很高兴见到你。', tip: '안녕(安宁)+하세요(你好)，字面意为"安宁吗"' },
      { word: '감사합니다', roman: 'gamsahamnida', meaning: '谢谢', sentence: '도와주셔서 감사합니다.', sentenceTr: '感谢您的帮助。', tip: '감사(感谢)是汉字词，源自"感謝"' },
      { word: '사랑', roman: 'sarang', meaning: '爱', sentence: '사랑해요.', sentenceTr: '我爱你。', tip: '韩剧经典台词必备词汇' },
      { word: '친구', roman: 'chingu', meaning: '朋友', sentence: '이분은 제 친구입니다.', sentenceTr: '这位是我的朋友。', tip: '친(亲)+구(故)，亲近的人' },
      { word: '학교', roman: 'hakgyo', meaning: '学校', sentence: '학교에 갑니다.', sentenceTr: '去学校。', tip: '학(学)+교(校)，汉字词"学校"' },
      { word: '물', roman: 'mul', meaning: '水', sentence: '물 한 잔 주세요.', sentenceTr: '请给我一杯水。', tip: '单音节词，注意收音ㄹ的发音' },
      { word: '책', roman: 'chaek', meaning: '书', sentence: '이 책을 읽고 있어요.', sentenceTr: '我正在读这本书。', tip: '收音ㄱ在词尾发 k 音' },
      { word: '음식', roman: 'eumsik', meaning: '食物', sentence: '한국 음식을 좋아해요.', sentenceTr: '我喜欢韩国食物。', tip: '음(饮)+식(食)，汉字词"饮食"' },
      { word: '시간', roman: 'sigan', meaning: '时间', sentence: '시간이 없어요.', sentenceTr: '没有时间了。', tip: '시(时)+간(间)，汉字词"时间"' },
      { word: '사람', roman: 'saram', meaning: '人', sentence: '좋은 사람이에요.', sentenceTr: '是个好人。', tip: '基本词汇，日常高频使用' },
      { word: '집', roman: 'jip', meaning: '家', sentence: '집에 가고 싶어요.', sentenceTr: '想回家。', tip: '收音ㅂ发 p 音，不爆破' },
      { word: '이름', roman: 'ireum', meaning: '名字', sentence: '이름이 뭐예요?', sentenceTr: '你叫什么名字？', tip: '이(名)+름，日常必问' },
      { word: '오늘', roman: 'oneul', meaning: '今天', sentence: '오늘 날씨가 좋아요.', sentenceTr: '今天天气好。', tip: '时间词，高频使用' },
      { word: '내일', roman: 'naeil', meaning: '明天', sentence: '내일 만나요.', sentenceTr: '明天见。', tip: '내(来)+일(日)，来临的日子' },
      { word: '어제', roman: 'eoje', meaning: '昨天', sentence: '어제 영화를 봤어요.', sentenceTr: '昨天看了电影。', tip: '时间词，注意ㅓ的发音' },
    ],
    intermediate: [
      { word: '경험', roman: 'gyeongheom', meaning: '经验', sentence: '다양한 경험을 해보세요.', sentenceTr: '请尝试各种经验。', tip: '경(经)+험(验)，汉字词"经验"' },
      { word: '가능성', roman: 'ganeungseong', meaning: '可能性', sentence: '가능성이 높아요.', sentenceTr: '可能性很高。', tip: '가능(可能)+성(性)' },
      { word: '환경', roman: 'hwangyeong', meaning: '环境', sentence: '환경 보호가 중요해요.', sentenceTr: '环境保护很重要。', tip: '환(环)+경(境)，汉字词"环境"' },
      { word: '사회', roman: 'sahoe', meaning: '社会', sentence: '현대 사회의 문제예요.', sentenceTr: '这是现代社会的问题。', tip: '사(社)+회(会)，汉字词"社会"' },
      { word: '문화', roman: 'munhwa', meaning: '文化', sentence: '한국 문화에 관심이 있어요.', sentenceTr: '我对韩国文化感兴趣。', tip: '문(文)+화(化)，汉字词"文化"' },
      { word: '경제', roman: 'gyeongje', meaning: '经济', sentence: '경제가 어려워요.', sentenceTr: '经济很困难。', tip: '경(经)+제(济)，汉字词"经济"' },
      { word: '기술', roman: 'gisul', meaning: '技术', sentence: '기술이 발전하고 있어요.', sentenceTr: '技术正在发展。', tip: '기(技)+술(术)，汉字词"技术"' },
      { word: '발전', roman: 'baljeon', meaning: '发展', sentence: '빠른 발전을 이루었어요.', sentenceTr: '实现了快速发展。', tip: '발(发)+전(展)，汉字词"发展"' },
      { word: '혁신', roman: 'hyeoksin', meaning: '革新', sentence: '기술 혁신이 필요해요.', sentenceTr: '需要技术革新。', tip: '혁(革)+신(新)，汉字词"革新"' },
      { word: '도전', roman: 'dojeon', meaning: '挑战', sentence: '새로운 도전을 시작해요.', sentenceTr: '开始新的挑战。', tip: '도(挑)+전(战)，汉字词"挑战"' },
      { word: '성공', roman: 'seonggong', meaning: '成功', sentence: '성공을 위해 노력해요.', sentenceTr: '为成功而努力。', tip: '성(成)+공(功)，汉字词"成功"' },
      { word: '행복', roman: 'haengbok', meaning: '幸福', sentence: '행복한 삶을 살고 싶어요.', sentenceTr: '想过幸福的生活。', tip: '행(幸)+복(福)，汉字词"幸福"' },
      { word: '자유', roman: 'jayu', meaning: '自由', sentence: '자유를 원해요.', sentenceTr: '渴望自由。', tip: '자(自)+유(由)，汉字词"自由"' },
      { word: '평화', roman: 'pyeonghwa', meaning: '和平', sentence: '세계 평화를 바라요.', sentenceTr: '期盼世界和平。', tip: '평(平)+화(和)，汉字词"和平"' },
      { word: '미래', roman: 'mirae', meaning: '未来', sentence: '미래를 준비해야 해요.', sentenceTr: '需要为未来做准备。', tip: '미(未)+래(来)，汉字词"未来"' },
    ],
    advanced: [
      { word: '철학적', roman: 'cheolhakjeok', meaning: '哲学的', sentence: '철학적 사고가 필요해요.', sentenceTr: '需要哲学思考。', tip: '철(哲)+학(学)+적(的)' },
      { word: '실존주의', roman: 'siljonjuui', meaning: '存在主义', sentence: '실존주의 철학을 공부해요.', sentenceTr: '学习存在主义哲学。', tip: '실(实)+존(存)+주(主)+의(义)' },
      { word: '현상학', roman: 'hyeonsanghak', meaning: '现象学', sentence: '현상학적 접근 방법을 써요.', sentenceTr: '采用现象学的研究方法。', tip: '현(现)+상(象)+학(学)' },
      { word: '변증법', roman: 'byeonjeungbeop', meaning: '辩证法', sentence: '변증법적 사고방식이에요.', sentenceTr: '这是辩证的思维方式。', tip: '변(变)+증(证)+법(法)' },
      { word: '인식론', roman: 'insikron', meaning: '认识论', sentence: '인식론의 핵심 문제예요.', sentenceTr: '这是认识论的核心问题。', tip: '인(认)+식(识)+론(论)' },
      { word: '윤리학', roman: 'yllihak', meaning: '伦理学', sentence: '윤리학적 관점에서 보면...', sentenceTr: '从伦理学角度来看……', tip: '윤(伦)+리(理)+학(学)' },
      { word: '미학', roman: 'mihak', meaning: '美学', sentence: '미학적 가치를 평가해요.', sentenceTr: '评估美学价值。', tip: '미(美)+학(学)' },
      { word: '형이상학', roman: 'hyeongisanghak', meaning: '形而上学', sentence: '형이상학적 질문이에요.', sentenceTr: '这是形而上学的问题。', tip: '형(形)+이(而)+상(上)+학(学)' },
      { word: '논리학', roman: 'nollihak', meaning: '逻辑学', sentence: '논리학의 기본 원리예요.', sentenceTr: '这是逻辑学的基本原理。', tip: '논(论)+리(理)+학(学)' },
      { word: '존재론', roman: 'jonjaeron', meaning: '本体论', sentence: '존재론적 관점을 제시해요.', sentenceTr: '提出本体论的观点。', tip: '존(存)+재(在)+론(论)' },
      { word: '주체성', roman: 'jucheseong', meaning: '主体性', sentence: '주체성을 확립해야 해요.', sentenceTr: '需要确立主体性。', tip: '주(主)+체(体)+성(性)' },
      { word: '합리성', roman: 'hapriseong', meaning: '合理性', sentence: '합리성을 갖추어야 해요.', sentenceTr: '必须具备合理性。', tip: '합(合)+리(理)+성(性)' },
      { word: '보편성', roman: 'bopyeonseong', meaning: '普遍性', sentence: '보편성을 지닌 진리예요.', sentenceTr: '是具有普遍性的真理。', tip: '보(普)+편(遍)+성(性)' },
      { word: '특수성', roman: 'teukuseong', meaning: '特殊性', sentence: '특수성을 고려해야 해요.', sentenceTr: '需要考虑特殊性。', tip: '특(特)+수(殊)+성(性)' },
      { word: '당위성', roman: 'dangwiseong', meaning: '当为性', sentence: '당위성을 지닌 명제예요.', sentenceTr: '是具有当为性的命题。', tip: '당(当)+위(为)+성(성)' },
    ]
  },

  // ========================================
  // 3. SPEAKING - Scenario Sentences (8 categories, >=8 each)
  //    syllables are auto-generated from korean at render time
  // ========================================
  speaking: {
    categories: [
      {
        id: 'greeting', name: '问候寒暄', icon: '👋', color: '#FF6B6B',
        sentences: [
          { korean: '안녕하세요! 만나서 반갑습니다.', roman: 'annyeonghaseyo! mannaseo bangapseumnida', chinese: '你好！很高兴见到你。' },
          { korean: '오랜만이에요. 잘 지냈어요?', roman: 'oraenmanieyo. jal jinaesseoyo?', chinese: '好久不见。过得好吗？' },
          { korean: '안녕히 가세요. 다음에 또 봐요.', roman: 'annyeonghi gaseyo. da-eume tto bwayo', chinese: '再见（请慢走）。下次再见。' },
          { korean: '요즘 어떻게 지내세요?', roman: 'yojeum eotteoke jinaeseyo?', chinese: '最近过得怎么样？' },
          { korean: '식사 하셨어요?', roman: 'siksa hasyeosseoyo?', chinese: '吃饭了吗？（常用问候）' },
          { korean: '오늘 날씨가 정말 좋네요.', roman: 'oneul nalssiga jeongmal johneyo', chinese: '今天天气真好啊。' },
          { korean: '잘 부탁드립니다.', roman: 'jal butakdeureumnida', chinese: '请多关照。' },
          { korean: '수고하셨어요.', roman: 'sugohasyeosseoyo', chinese: '辛苦了。（道别或慰劳）' },
        ]
      },
      {
        id: 'ordering', name: '餐厅点餐', icon: '🍜', color: '#FFA94D',
        sentences: [
          { korean: '메뉴 좀 보여주세요.', roman: 'menyu jom boyeojuseyo', chinese: '请给我看一下菜单。' },
          { korean: '불고기 2인분 주세요.', roman: 'bulgogi i-inbun juseyo', chinese: '请给我两人份烤肉。' },
          { korean: '이거 매워요? 안 매운 걸로 주세요.', roman: 'igeo maewoyo? an maeun geollo juseyo', chinese: '这个辣吗？请给我不辣的。' },
          { korean: '물 좀 더 주세요.', roman: 'mul jom deo juseyo', chinese: '请再给我点水。' },
          { korean: '추천 메뉴 있어요?', roman: 'chucheon menyu isseoyo?', chinese: '有推荐菜吗？' },
          { korean: '계산서 주세요.', roman: 'gyesanseo juseyo', chinese: '请给我账单。' },
          { korean: '맛있게 잘 먹었습니다.', roman: 'masitge jal meogeotseumnida', chinese: '我吃得很饱很好（餐后客套）。' },
          { korean: '여기 잔치국수 하나 주세요.', roman: 'yeogi janchi-guksu hana juseyo', chinese: '请给我一碗宴席汤面。' },
        ]
      },
      {
        id: 'directions', name: '问路出行', icon: '🗺️', color: '#4DABF7',
        sentences: [
          { korean: '실례합니다. 역이 어디에 있어요?', roman: 'sillyehamnida. yeogi eodie isseoyo?', chinese: '打扰一下。车站在哪里？' },
          { korean: '이 근처에 화장실이 있나요?', roman: 'i geuncheoe hwajangsiri innayo?', chinese: '这附近有洗手间吗？' },
          { korean: '쭉 가시다가 오른쪽으로 가세요.', roman: 'jjuk gasidaga oreunjjogeuro gaseyo', chinese: '一直走，然后右转。' },
          { korean: '걸어서 얼마나 걸려요?', roman: 'georeoseo eolmana geollyeoyo?', chinese: '走路要多久？' },
          { korean: '지하철역이 어떻게 가요?', roman: 'jihacheolyeogi eotteoke gayo?', chinese: '地铁站怎么走？' },
          { korean: '버스 정류장이 어디예요?', roman: 'beoseu jeongnyujangi eodieyo?', chinese: '公交车站在哪里？' },
          { korean: '지도 좀 보여주실래요?', roman: 'jido jom boyeojusillaeyo?', chinese: '能给我看一下地图吗？' },
          { korean: '여기서 명동까지 얼마예요?', roman: 'yeogiseo Myeongdongkkaji eolmayeyo?', chinese: '从这里到明洞多少钱（打车）？' },
        ]
      },
      {
        id: 'shopping', name: '购物消费', icon: '🛍️', color: '#9775FA',
        sentences: [
          { korean: '이거 얼마예요?', roman: 'igeo eolmayeyo?', chinese: '这个多少钱？' },
          { korean: '좀 깎아주세요.', roman: 'jom kkakkajuseyo', chinese: '请便宜一点吧。' },
          { korean: '다른 색깔 있어요?', roman: 'dareun saekkkal isseoyo?', chinese: '有其他颜色吗？' },
          { korean: '카드 되나요? 현금으로 낼게요.', roman: 'kadeu doenayo? hyeongeumeuro naelgeyo', chinese: '可以刷卡吗？我用现金付。' },
          { korean: '사이즈 더 큰 거 있어요?', roman: 'saijeu deo keun geo isseoyo?', chinese: '有更大号的吗？' },
          { korean: '포장해 주세요.', roman: 'pojanghae juseyo', chinese: '请帮我包装（礼盒）。' },
          { korean: '환불 가능해요?', roman: 'hwanbul ganeunghaeyo?', chinese: '可以退货吗？' },
          { korean: '영수증 주세요.', roman: 'yeongsujeung juseyo', chinese: '请给我发票/收据。' },
        ]
      },
      {
        id: 'daily', name: '日常生活', icon: '☀️', color: '#51CF66',
        sentences: [
          { korean: '오늘 날씨가 정말 좋네요.', roman: 'oneul nalssiga jeongmal johneyo', chinese: '今天天气真好。' },
          { korean: '조금 피곤해요. 쉬고 싶어요.', roman: 'jogeum pigonhaeyo. swigo sipeoyo', chinese: '有点累。想休息一下。' },
          { korean: '주말에 뭐 할 거예요?', roman: 'jumare mwo hal geoyeyo?', chinese: '周末打算做什么？' },
          { korean: '같이 영화 볼래요?', roman: 'gachi yeonghwa bollaeyo?', chinese: '要一起看电影吗？' },
          { korean: '배고파요. 뭐 먹을까요?', roman: 'baegopayo. mwo meogeulkayo?', chinese: '我饿了。吃点什么呢？' },
          { korean: '시간 있어요? 잠깐 이야기해요.', roman: 'sigan isseoyo? jamkkan iyagihaeyo', chinese: '有时间吗？聊一会儿吧。' },
          { korean: '감기 걸렸어요. 몸이 안 좋아요.', roman: 'gamgi geollyeosseoyo. momi an joayo', chinese: '我感冒了。身体不舒服。' },
          { korean: '내일 약속이 있어요.', roman: 'naeil yaksogi isseoyo', chinese: '明天有约会。' },
        ]
      },
      {
        id: 'travel', name: '旅游观光', icon: '✈️', color: '#22B8CF',
        sentences: [
          { korean: '이 곳이 어디예요?', roman: 'i gosi eodieyo?', chinese: '这是哪里？' },
          { korean: '관광 안내소가 어디 있어요?', roman: 'gwangwang annaisoga eodi isseoyo?', chinese: '旅游咨询处在哪里？' },
          { korean: '유명한 명소가 뭐예요?', roman: 'yumyeonghan myeongso-ga mwoyeyo?', chinese: '有名的景点是什么？' },
          { korean: '입장료가 얼마예요?', roman: 'ipjangnyoga eolmayeyo?', chinese: '门票多少钱？' },
          { korean: '사진 좀 찍어도 돼요?', roman: 'sajin jom jjigeodo dwaeyo?', chinese: '可以拍张照吗？' },
          { korean: '몇 시에 문을 닫아요?', roman: 'myeot sie muneul dadayo?', chinese: '几点关门？' },
          { korean: '투어 버스는 어디서 타요?', roman: 'tu-eo beoseuneun eodiseo tayo?', chinese: '观光巴士在哪里坐？' },
          { korean: '기념품 가게가 어디예요?', roman: 'ginyeompum gagega eodieyo?', chinese: '纪念品店在哪里？' },
        ]
      },
      {
        id: 'phone', name: '电话沟通', icon: '📞', color: '#E64980',
        sentences: [
          { korean: '여보세요?', roman: 'yeoboseyo?', chinese: '喂？（接电话）' },
          { korean: '지금 통화 가능해요?', roman: 'jigeum tonghwa ganeunghaeyo?', chinese: '现在方便通话吗？' },
          { korean: '전화 잘못 거셨어요.', roman: 'jeonhwa jalmot geosyeosseoyo', chinese: '您打错了。' },
          { korean: '메시지 남겨주세요.', roman: 'mesiji namgyeojuseyo', chinese: '请留言。' },
          { korean: '나중에 다시 전화할게요.', roman: 'najunge dasi jeonhwahalgeyo', chinese: '我稍后再打给您。' },
          { korean: '누구세요?', roman: 'nuguseyo?', chinese: '请问您是哪位？' },
          { korean: '문자로 보내드릴게요.', roman: 'munjaro bonaedeurilgeyo', chinese: '我发短信给您。' },
          { korean: '전화번호 알려주세요.', roman: 'jeonhwabeonho allyeojuseyo', chinese: '请告诉我电话号码。' },
        ]
      },
      {
        id: 'hospital', name: '医院健康', icon: '🏥', color: '#FA5252',
        sentences: [
          { korean: '아파요. 병원에 가야 해요.', roman: 'apayo. byeong-wone gaya haeyo', chinese: '我疼。得去医院。' },
          { korean: '어디가 불편하세요?', roman: 'eodiga bulpyeonhaseyo?', chinese: '您哪里不舒服？' },
          { korean: '약을 먹었어요.', roman: 'yageul meogeosseoyo', chinese: '我吃过药了。' },
          { korean: '알레르기가 있어요.', roman: 'allereugiga isseoyo', chinese: '我有过敏。' },
          { korean: '처방전 주세요.', roman: 'cheobangjeon juseyo', chinese: '请给我处方。' },
          { korean: '주사 맞았어요.', roman: 'juja majasseoyo', chinese: '我打针了。' },
          { korean: '언제 다시 와요?', roman: 'eonje dasi wayo?', chinese: '什么时候再来？' },
          { korean: '병원 문 여세요?', roman: 'byeongwon mun yeoseyo?', chinese: '医院开门吗？（确认营业）' },
        ]
      },
    ]
  },

  // ========================================
  // 4. DIALOGUE - Scenario Conversations
  // ========================================
  dialogue: {
    scenarios: [
      {
        id: 'coffee', name: '咖啡店点单', icon: '☕', color: '#D9A066',
        description: '在首尔的一家咖啡店里，你作为顾客与店员对话',
        aiRole: '店员',
        userRole: '顾客',
        steps: [
          { ai: '어서 오세요! 뭐 드릴까요?', aiTr: '欢迎光临！请问要点什么？', options: [
            { text: '아메리카노 한 잔 주세요.', textTr: '请给我一杯美式咖啡。', correct: true, feedback: '很好！这是标准的点单方式。' },
            { text: '메뉴 보여주세요.', textTr: '请给我看菜单。', correct: true, feedback: '好的，想先看菜单再点单也是自然的表达。' },
            { text: '안녕하세요.', textTr: '你好。', correct: false, feedback: '虽然是礼貌问候，但在点单场景中更直接表达需求会更好。可以说"아메리카노 한 잔 주세요"' },
          ]},
          { ai: '사이즈는 어떤 걸로 드릴까요? 톨, 그란데, 벤티 있어요.', aiTr: '请问要什么尺寸？有中杯、大杯、超大杯。', options: [
            { text: '그란데로 주세요.', textTr: '请给我大杯。', correct: true, feedback: '完美！"~로 주세요"是选择尺寸的常用表达。' },
            { text: '제일 큰 걸로 주세요.', textTr: '请给我最大的。', correct: true, feedback: '好的表达！也可以说"벤티로 주세요"更具体。' },
            { text: '사이즈?', textTr: '尺寸？', correct: false, feedback: '过于简短不太礼貌。可以说"사이즈는 뭐가 있어요?"（有什么尺寸？）' },
          ]},
          { ai: '드시고 가세요? 포장이세요?', aiTr: '在这里喝还是打包？', options: [
            { text: '여기서 마실게요.', textTr: '在这里喝。', correct: true, feedback: '正确！"여기서 마실게요"是堂食的标准说法。' },
            { text: '포장해 주세요.', textTr: '请打包。', correct: true, feedback: '好的！"포장해 주세요"是打包的常用表达。' },
            { text: '네.', textTr: '好的。', correct: false, feedback: '回答太模糊。请明确说"여기서 마실게요"或"포장해 주세요"。' },
          ]},
          { ai: '결제는 카드로 하시겠어요?', aiTr: '用卡支付吗？', options: [
            { text: '네, 카드로 할게요.', textTr: '好的，用卡。', correct: true, feedback: '完美！简单的确认回答。' },
            { text: '현금으로 낼게요.', textTr: '我用现金付。', correct: true, feedback: '好的表达！"현금으로 낼게요"是现金支付的说法。' },
            { text: '얼마예요?', textTr: '多少钱？', correct: false, feedback: '在对方已经询问支付方式时，应先回答支付方式。可以加问"얼마예요?"但先回答卡或现金。' },
          ]},
        ]
      },
      {
        id: 'meeting', name: '初次见面', icon: '🤝', color: '#FF8787',
        description: '在朋友聚会上，你第一次见到韩国朋友',
        aiRole: '韩国朋友',
        userRole: '你',
        steps: [
          { ai: '안녕하세요! 처음 뵙겠습니다. 저는 김민준이라고 합니다.', aiTr: '你好！初次见面。我叫金敏俊。', options: [
            { text: '안녕하세요! 만나서 반갑습니다. 저는 이렇게 말합니다.', textTr: '你好！很高兴见到你。我叫……', correct: true, feedback: '完美的自我介绍！"처음 뵙겠습니다"和"만나서 반갑습니다"都是正式的初次见面问候。' },
            { text: '안녕! 나는 그냥 친구야.', textTr: '嗨！我就是个朋友。', correct: false, feedback: '初次见面应使用敬语。请说"안녕하세요! 만나서 반갑습니다"' },
          ]},
          { ai: '어디에서 오셨어요?', aiTr: '你从哪里来？', options: [
            { text: '중국에서 왔어요.', textTr: '我从中国来。', correct: true, feedback: '正确简洁的回答！' },
            { text: '저는 중국 사람입니다. 베이징에서 왔어요.', textTr: '我是中国人。从北京来。', correct: true, feedback: '很好！提供了更多信息，对话更自然。' },
            { text: '응, 거기서.', textTr: '嗯，从那里。', correct: false, feedback: '太随意且不清楚。应明确说"중국에서 왔어요"' },
          ]},
          { ai: '한국어를 잘하시네요! 얼마나 배웠어요?', aiTr: '你韩语说得很好！学了多久了？', options: [
            { text: '감사합니다. 6개월 정도 배웠어요.', textTr: '谢谢。学了大概6个月。', correct: true, feedback: '谦虚又自然地回答了赞美，非常好！' },
            { text: '아직 잘 못해요. 열심히 공부하고 있어요.', textTr: '还不太行。正在努力学习。', correct: true, feedback: '韩式谦虚！这在韩国文化中很受欢迎。' },
            { text: '네, 잘해요.', textTr: '嗯，很好。', correct: false, feedback: '直接接受赞美在韩国文化中显得不够谦虚。可以说"아직 많이 부족해요"' },
          ]},
          { ai: '취미가 뭐예요?', aiTr: '你的爱好是什么？', options: [
            { text: '영화 보는 것을 좋아해요.', textTr: '我喜欢看电影。', correct: true, feedback: '正确！"~는 것을 좋아해요"是表达爱好的常用句型。' },
            { text: '음악 듣기랑 독서를 좋아해요.', textTr: '喜欢听音乐和读书。', correct: true, feedback: '好！列举多个爱好时用"랑"连接很自然。' },
            { text: '놀아요.', textTr: '玩。', correct: false, feedback: '太简短。可以用"~하는 것을 좋아해요"来具体描述。' },
          ]},
        ]
      },
      {
        id: 'taxi', name: '乘坐出租', icon: '🚕', color: '#FFD43B',
        description: '在首尔街头，你需要打车前往目的地',
        aiRole: '出租车司机',
        userRole: '乘客',
        steps: [
          { ai: '어디로 모실까요?', aiTr: '请问去哪里？', options: [
            { text: '서울역으로 가주세요.', textTr: '请去首尔站。', correct: true, feedback: '正确！"~으로 가주세요"是告诉目的地最常用的说法。' },
            { text: '이 주소로 가주세요.', textTr: '请去这个地址。', correct: true, feedback: '好！如果不确定地名，出示地址也是好方法。' },
            { text: '저기요.', textTr: '那个……', correct: false, feedback: '需要明确说出目的地。可以说"서울역으로 가주세요"' },
          ]},
          { ai: '네, 알겠습니다. 고속도로로 갈까요? 시내로 갈까요?', aiTr: '好的，知道了。走高速公路还是市内？', options: [
            { text: '빠른 쪽으로 가주세요.', textTr: '请走快的路。', correct: true, feedback: '好！让司机选择更快路线是常见做法。' },
            { text: '시내로 가주세요.', textTr: '请走市内。', correct: true, feedback: '明确选择路线，很好。' },
            { text: '몰라요.', textTr: '不知道。', correct: false, feedback: '不太礼貌。可以说"빠른 쪽으로 가주세요"让司机决定。' },
          ]},
          { ai: '얼마나 걸려요?', aiTr: '（到达后）需要多久？', options: [
            { text: '감사합니다. 얼마예요?', textTr: '谢谢。多少钱？', correct: true, feedback: '到达后先道谢再问价格，很礼貌。' },
            { text: '영수증 주세요.', textTr: '请给我收据。', correct: true, feedback: '好！要收据是常见需求。' },
            { text: '내려요.', textTr: '下车。', correct: false, feedback: '下车前应先付费和道谢。可以说"얼마예요? 감사합니다."' },
          ]},
        ]
      },
      {
        id: 'restaurant', name: '餐厅点餐', icon: '🍽️', color: '#FF922B',
        description: '在韩国餐厅里，你作为顾客与服务员对话',
        aiRole: '服务员',
        userRole: '顾客',
        steps: [
          { ai: '어서 오세요! 몇 분이세요?', aiTr: '欢迎光临！几位？', options: [
            { text: '저희 두 명이에요.', textTr: '我们两位。', correct: true, feedback: '正确！"저희 두 명이에요"是告知人数的标准说法。' },
            { text: '테이블 하나 주세요.', textTr: '请给我一张桌子。', correct: true, feedback: '也可以，但先报人数更自然。' },
            { text: '안녕하세요.', textTr: '你好。', correct: false, feedback: '进餐厅应先说明人数，如"저희 두 명이에요"。' },
          ]},
          { ai: '이쪽으로 앉으세요. 메뉴 보세요.', aiTr: '请坐这边。请看菜单。', options: [
            { text: '추천 메뉴 있어요?', textTr: '有推荐菜吗？', correct: true, feedback: '好！点餐前问推荐很自然。' },
            { text: '뭐가 맛있어요?', textTr: '什么好吃？', correct: true, feedback: '自然表达。' },
            { text: '그냥 줘요.', textTr: '直接给我吧。', correct: false, feedback: '太粗鲁。礼貌说法应为"추천 메뉴 있어요?"。' },
          ]},
          { ai: '주문하시겠어요?', aiTr: '要点餐了吗？', options: [
            { text: '불고기랑 김치찌개 주세요.', textTr: '请给我烤肉和泡菜汤。', correct: true, feedback: '完美！用"랑"连接两道菜很自然。' },
            { text: '물만 주세요.', textTr: '只给我水。', correct: true, feedback: '简洁明确。' },
            { text: '배고파요.', textTr: '我饿了。', correct: false, feedback: '应明确点菜，如"불고기 주세요"。' },
          ]},
          { ai: '음료는 어떠세요?', aiTr: '饮品要什么？', options: [
            { text: '콜라 하나 주세요.', textTr: '请给我一杯可乐。', correct: true, feedback: '好！明确点单。' },
            { text: '물로 할게요.', textTr: '我要水。', correct: true, feedback: '简洁自然。' },
            { text: '몰라요.', textTr: '不知道。', correct: false, feedback: '可以说"콜라 주세요"或"물로 할게요"。' },
          ]},
        ]
      },
      {
        id: 'convenience', name: '便利店购物', icon: '🏪', color: '#94D82D',
        description: '在便利店结账时，你与店员对话',
        aiRole: '店员',
        userRole: '顾客',
        steps: [
          { ai: '어서 오세요!', aiTr: '欢迎光临！', options: [
            { text: '이거 얼마예요?', textTr: '这个多少钱？', correct: true, feedback: '自然询价。' },
            { text: '안녕하세요.', textTr: '你好。', correct: false, feedback: '便利店可直接问价，"이거 얼마예요?"更实用。' },
          ]},
          { ai: '포인트 카드 있으세요?', aiTr: '有积分卡吗？', options: [
            { text: '네, 여기 있어요.', textTr: '有，在这里。', correct: true, feedback: '好！出示积分卡。' },
            { text: '없어요. 새로 만들게요.', textTr: '没有，我办一张。', correct: true, feedback: '也可以现场办卡。' },
            { text: '아니요.', textTr: '没有。', correct: true, feedback: '可以，但"없어요"比"아니요"更自然。' },
          ]},
          { ai: '따뜻한 걸로 드릴까요 차가운 걸로 드릴까요?', aiTr: '要热的还是冷的？', options: [
            { text: '따뜻한 걸로 주세요.', textTr: '请给我热的。', correct: true, feedback: '明确冷热，很好。' },
            { text: '차가운 걸로 해주세요.', textTr: '请给我冷的。', correct: true, feedback: '自然表达。' },
            { text: '그냥 주세요.', textTr: '直接给我。', correct: false, feedback: '明确冷热更清楚。' },
          ]},
          { ai: '다 되셨어요?', aiTr: '都好了吗？', options: [
            { text: '네, 이거 다예요.', textTr: '是的，就这些。', correct: true, feedback: '明确结束购物。' },
            { text: '더 볼게요.', textTr: '我再看看。', correct: true, feedback: '想再多看也完全可以。' },
            { text: '응.', textTr: '嗯。', correct: false, feedback: '用"네"比"응"更礼貌。' },
          ]},
        ]
      },
      {
        id: 'askdirections', name: '问路', icon: '🧭', color: '#4DABF7',
        description: '在街头，你向路人询问路线',
        aiRole: '路人',
        userRole: '你',
        steps: [
          { ai: '실례합니다. 길 좀 물어볼게요.', aiTr: '打扰一下，我想问路。', options: [
            { text: '네, 말씀하세요.', textTr: '好的，请说。', correct: true, feedback: '礼貌地回应。' },
            { text: '어디 가세요?', textTr: '你去哪儿？', correct: false, feedback: '你是问路方，应先说目的地。应为"명동 어떻게 가요?"。' },
          ]},
          { ai: '명동 어떻게 가요?', aiTr: '明洞怎么走？', options: [
            { text: '지하철 2호선 타세요.', textTr: '请坐地铁2号线。', correct: true, feedback: '正确！给出具体路线。' },
            { text: '곧장 가세요.', textTr: '一直走。', correct: true, feedback: '可补充"지하철이 제일 빨라요"更完整。' },
            { text: '모르겠어요.', textTr: '不知道。', correct: false, feedback: '若不知可说"죄송해요, 잘 모르겠어요"。' },
          ]},
          { ai: '여기서 멀어요?', aiTr: '离这里远吗？', options: [
            { text: '아니요, 가까워요. 도보 10분이에요.', textTr: '不远，步行10分钟。', correct: true, feedback: '给出具体距离，很实用。' },
            { text: '좀 멀어요. 택시 타세요.', textTr: '有点远，打车吧。', correct: true, feedback: '合理建议。' },
            { text: '멀어요.', textTr: '远。', correct: false, feedback: '补充具体信息更好，如"도보 10분"。' },
          ]},
        ]
      },
      {
        id: 'selfintro', name: '自我介绍', icon: '🪪', color: '#9775FA',
        description: '在活动场合，你向大家做自我介绍',
        aiRole: '主持人',
        userRole: '你',
        steps: [
          { ai: '안녕하세요! 자기소개 해주세요.', aiTr: '你好！请做个自我介绍。', options: [
            { text: '안녕하세요. 저는 중국에서 온 리밍입니다.', textTr: '你好，我是从中国来的李明。', correct: true, feedback: '完美！包含名字与来历。' },
            { text: '저는 학생이에요.', textTr: '我是学生。', correct: true, feedback: '可加上名字更完整，如"저는 리밍입니다"。' },
            { text: '안녕.', textTr: '嗨。', correct: false, feedback: '自我介绍应包含名字与来历。' },
          ]},
          { ai: '취미가 뭐예요?', aiTr: '你的爱好是什么？', options: [
            { text: '사진 찍는 걸 좋아해요.', textTr: '我喜欢拍照。', correct: true, feedback: '具体爱好，自然。' },
            { text: '운동하는 것을 좋아해요.', textTr: '我喜欢运动。', correct: true, feedback: '很好！' },
            { text: '그냥 쉬어요.', textTr: '就休息。', correct: false, feedback: '可说"독서를 좋아해요"等具体爱好。' },
          ]},
          { ai: '한국어를 왜 배워요?', aiTr: '为什么学韩语？', options: [
            { text: '한국 드라마를 좋아해서요.', textTr: '因为喜欢韩剧。', correct: true, feedback: '自然的原因说明。' },
            { text: '한국 친구가 있어서요.', textTr: '因为有韩国朋友。', correct: true, feedback: '很好的理由。' },
            { text: '그냥요.', textTr: '就是。', correct: false, feedback: '给出原因更自然。' },
          ]},
        ]
      },
      {
        id: 'refuse', name: '拒绝请求', icon: '🙅', color: '#E64980',
        description: '面对他人的请求，学习礼貌地拒绝',
        aiRole: '朋友',
        userRole: '你',
        steps: [
          { ai: '주말에 우리 같이 영화 보러 갈래요?', aiTr: '周末要一起去看电影吗？', options: [
            { text: '죄송해요, 그날 바빠서 못 갈 것 같아요.', textTr: '抱歉，那天忙可能去不了。', correct: true, feedback: '礼貌拒绝并说明原因，很得体。' },
            { text: '다음에 꼭 같이 가요.', textTr: '下次一定一起去。', correct: true, feedback: '用"下次"缓和拒绝。' },
            { text: '싫어요.', textTr: '不想去。', correct: false, feedback: '太直接，用"죄송해요, 바빠서요"更礼貌。' },
          ]},
          { ai: '이거 도와줄 수 있어요?', aiTr: '这个能帮我一下吗？', options: [
            { text: '미안해요, 지금 좀 어려울 것 같아요.', textTr: '抱歉，现在可能有点困难。', correct: true, feedback: '委婉表达困难。' },
            { text: '제가 할 수 있는 데까지 도와줄게요.', textTr: '我尽量帮到能帮的程度。', correct: true, feedback: '部分答应也很得体。' },
            { text: '안 돼요.', textTr: '不行。', correct: false, feedback: '太生硬，可说"미안해요, 어려울 것 같아요"。' },
          ]},
          { ai: '저한테 돈 좀 빌려줄래요?', aiTr: '能借我点钱吗？', options: [
            { text: '죄송해요, 제가 준비 못 했어요.', textTr: '抱歉，我没准备好。', correct: true, feedback: '礼貌拒绝借钱。' },
            { text: '나중에 얘기해요.', textTr: '以后再说吧。', correct: true, feedback: '委婉推迟。' },
            { text: '안 빌려줘요.', textTr: '不借。', correct: false, feedback: '太直接，用"죄송해요"开头更礼貌。' },
          ]},
        ]
      },
    ]
  },

  // ========================================
  // 5. DRAMA - Korean Drama Clips
  // ========================================
  drama: {
    clips: [
      {
        id: 'd1', title: '冬日暖阳', genre: '浪漫', desc: '初雪日的告白场景',
        subtitleColor: '#FF6B9D',
        lines: [
          { korean: '첫눈이 오는 날, 당신을 만났어요.', chinese: '初雪降临的那天，我遇见了你。', words: [{ w: '첫눈', m: '初雪' }, { w: '만나다', m: '遇见' }] },
          { korean: '운명인 것 같아요. 이렇게 다시 만나다니.', chinese: '好像是命运。竟然这样再次相遇。', words: [{ w: '운명', m: '命运' }, { w: '다시', m: '再次' }] },
          { korean: '그때 왜 아무 말도 하지 않았어요?', chinese: '那时候你为什么什么都不说？', words: [{ w: '그때', m: '那时' }, { w: '아무', m: '什么也' }] },
          { korean: '말하지 않아도 알 수 있잖아요. 마음은.', chinese: '不说也能知道啊。心意。', words: [{ w: '마음', m: '心意' }, { w: '알다', m: '知道' }] },
          { korean: '이제부터라도, 내 곁에 있어줄래요?', chinese: '从现在开始，能留在我身边吗？', words: [{ w: '이제부터', m: '从现在起' }, { w: '곁', m: '身边' }] },
        ]
      },
      {
        id: 'd2', title: '深夜食堂', genre: '治愈', desc: '深夜小店里的人生对话',
        subtitleColor: '#74C0FC',
        lines: [
          { korean: '여기 앉아도 돼요?', chinese: '可以坐这里吗？', words: [{ w: '앉다', m: '坐' }, { w: '되다', m: '可以' }] },
          { korean: '물론이죠. 뭐 드릴까요?', chinese: '当然。请问要什么？', words: [{ w: '물론', m: '当然' }, { w: '드리다', m: '给（敬语）' }] },
          { korean: '라면 하나 주세요. 따뜻한 것.', chinese: '请给我一碗面。热的。', words: [{ w: '라면', m: '拉面' }, { w: '따뜻하다', m: '温暖的' }] },
          { korean: '힘든 하루였나 봐요. 표정에 다 나와 있어요.', chinese: '看来今天很辛苦。表情都写出来了。', words: [{ w: '힘들다', m: '辛苦' }, { w: '표정', m: '表情' }] },
          { korean: '괜찮아요. 이렇게 따뜻한 밥 한 그릇이면, 다 괜찮아져요.', chinese: '没事的。有这样一碗热饭，一切都会好起来的。', words: [{ w: '괜찮다', m: '没关系' }, { w: '밥', m: '饭' }] },
        ]
      },
      {
        id: 'd3', title: '青春记录', genre: '励志', desc: '追梦青年的内心独白',
        subtitleColor: '#69DB7C',
        lines: [
          { korean: '포기하지 마. 네 꿈은 아직 끝나지 않았어.', chinese: '不要放弃。你的梦想还没有结束。', words: [{ w: '포기', m: '放弃' }, { w: '꿈', m: '梦想' }] },
          { korean: '하지만 현실은 너무 가혹해.', chinese: '但现实太残酷了。', words: [{ w: '현실', m: '现实' }, { w: '가혹하다', m: '残酷' }] },
          { korean: '그래도 나아가야 해. 멈추면 거기가 끝이니까.', chinese: '即使如此也要前行。因为停下就等于结束。', words: [{ w: '나아가다', m: '前进' }, { w: '멈추다', m: '停下' }] },
          { korean: '언젠가는 빛날 거야. 우리의 청춘이.', chinese: '总有一天会闪耀的。我们的青春。', words: [{ w: '빛나다', m: '闪耀' }, { w: '청춘', m: '青春' }] },
          { korean: '그래, 계속 달리자. 끝까지.', chinese: '好，继续奔跑吧。直到最后。', words: [{ w: '달리다', m: '奔跑' }, { w: '끝', m: '结束' }] },
        ]
      },
      {
        id: 'd4', title: '家族餐桌', genre: '温情', desc: '家人间的日常对话',
        subtitleColor: '#FFA94D',
        lines: [
          { korean: '엄마, 밥 다 됐어?', chinese: '妈，饭好了吗？', words: [{ w: '엄마', m: '妈妈' }, { w: '밥', m: '饭' }] },
          { korean: '거의 다 됐어. 식탁 좀 차려줄래?', chinese: '快好了。能帮忙摆桌子吗？', words: [{ w: '식탁', m: '餐桌' }, { w: '차리다', m: '摆设' }] },
          { korean: '오늘 반찬 뭐야? 냄새 좋은데.', chinese: '今天什么菜？闻着好香。', words: [{ w: '반찬', m: '小菜' }, { w: '냄새', m: '味道' }] },
          { korean: '네가 좋아하는 김치찌개야. 어서 앉아.', chinese: '是你喜欢的泡菜汤。快坐下。', words: [{ w: '김치찌개', m: '泡菜汤' }, { w: '어서', m: '赶紧' }] },
          { korean: '잘 먹겠습니다! 역시 엄마 음식이 최고야.', chinese: '我开动了！果然妈妈做的菜最棒。', words: [{ w: '잘 먹다', m: '开吃' }, { w: '최고', m: '最棒' }] },
        ]
      },
      {
        id: 'd5', title: '我的解放日记', genre: '治愈', desc: '关于平凡生活的 liberated 独白',
        subtitleColor: '#74C0FC',
        lines: [
          { korean: '나는 언젠가는 행복해질 거야. 그게 내 일이니까.', chinese: '我总有一天会幸福的。因为这是我的事。', words: [{ w: '행복', m: '幸福' }, { w: '일', m: '事' }] },
          { korean: '나만의 속도로 가고 있을 뿐이야.', chinese: '我只是按自己的速度在走。', words: [{ w: '속도', m: '速度' }, { w: '가다', m: '走' }] },
          { korean: '그냥, 살아보려고.', chinese: '只是，想试着活下去。', words: [{ w: '살다', m: '活' }, { w: '보다', m: '试着' }] },
          { korean: '해방은 멀리 있지 않아. 지금 이 순간이야.', chinese: '解放并不遥远，就是此时此刻。', words: [{ w: '해방', m: '解放' }, { w: '순간', m: '瞬间' }] },
          { korean: '외롭지 않아. 난 나랑 있으니까.', chinese: '不孤单。因为我和自己在一起。', words: [{ w: '외롭다', m: '孤单' }, { w: '나', m: '我' }] },
        ]
      },
      {
        id: 'd6', title: '今生第一次', genre: '温情', desc: '第一次鼓起勇气的温柔台词',
        subtitleColor: '#FFA94D',
        lines: [
          { korean: '이번이 내 인생 첫 번째니까.', chinese: '因为这对我的人生是第一次。', words: [{ w: '인생', m: '人生' }, { w: '첫 번째', m: '第一次' }] },
          { korean: '처음이라 서툴지만, 진심이야.', chinese: '虽然是第一次有些生疏，但这是真心的。', words: [{ w: '처음', m: '第一次' }, { w: '진심', m: '真心' }] },
          { korean: '오늘은 평생 처음으로 말할게.', chinese: '今天我要说这辈子第一次说的话。', words: [{ w: '평생', m: '平生' }, { w: '말하다', m: '说' }] },
          { korean: '두려워도 해보고 싶었어.', chinese: '即使害怕，我也想试一次。', words: [{ w: '두렵다', m: '害怕' }, { w: '해보다', m: '试着做' }] },
          { korean: '첫사랑은 누구나 서툴잖아.', chinese: '初恋谁都是笨拙的啊。', words: [{ w: '첫사랑', m: '初恋' }, { w: '서툴다', m: '生疏' }] },
        ]
      },
      {
        id: 'd7', title: '请回答1988', genre: '浪漫', desc: '双门洞邻里与友情的经典台词',
        subtitleColor: '#FF6B9D',
        lines: [
          { korean: '사랑한다면 당연히 말해야지.', chinese: '如果爱，当然要说出来。', words: [{ w: '사랑', m: '爱' }, { w: '말하다', m: '说' }] },
          { korean: '우리 엄마가 제일 예쁘지?', chinese: '我妈妈最漂亮对吧？', words: [{ w: '엄마', m: '妈妈' }, { w: '예쁘다', m: '漂亮' }] },
          { korean: '친구는 가족보다 더 오래 남는 거야.', chinese: '朋友比家人更长久地留在生命里。', words: [{ w: '친구', m: '朋友' }, { w: '가족', m: '家人' }] },
          { korean: '너는 내 운명이야.', chinese: '你是我的命运。', words: [{ w: '운명', m: '命运' }] },
          { korean: '1988년 그 겨울, 우리가 다 커버렸어.', chinese: '1988年那个冬天，我们都长大了。', words: [{ w: '겨울', m: '冬天' }, { w: '크다', m: '长大' }] },
        ]
      },
      {
        id: 'd8', title: '努力克服自卑的我们', genre: '励志', desc: '给低自尊者的温柔处方',
        subtitleColor: '#69DB7C',
        lines: [
          { korean: '자존감이 낮아도 괜찮아. 천천히 채우면 돼.', chinese: '即使自卑也没关系，慢慢填补就好。', words: [{ w: '자존감', m: '自尊' }, { w: '채우다', m: '填满' }] },
          { korean: '네 가치는 남의 시선으로 정해지지 않아.', chinese: '你的价值不由别人的目光决定。', words: [{ w: '가치', m: '价值' }, { w: '시선', m: '目光' }] },
          { korean: '오늘도 버틴 너는 대단해.', chinese: '今天也撑过来的你很了不起。', words: [{ w: '버티다', m: '坚持' }, { w: '대단', m: '了不起' }] },
          { korean: '틀린 게 아니라, 아직 익숙하지 않은 거야.', chinese: '不是做错了，只是还不够熟练。', words: [{ w: '틀리다', m: '错' }, { w: '익숙', m: '熟练' }] },
          { korean: '나를 먼저 안아줘야 해.', chinese: '得先拥抱自己。', words: [{ w: '안아주다', m: '拥抱' }] },
        ]
      }
    ]
  },

  // ========================================
  // Helper: get daily word set
  // ========================================
  getDailyWords(level, dayOffset) {
    const pool = this.vocabulary[level] || this.vocabulary.beginner;
    const start = (dayOffset * 10) % pool.length;
    const words = [];
    for (let i = 0; i < 10; i++) {
      words.push(pool[(start + i) % pool.length]);
    }
    return words;
  }
};

// Export
if (typeof window !== 'undefined') {
  window.S_DATA = S_DATA;
}
