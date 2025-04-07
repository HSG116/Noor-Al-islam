document.addEventListener("DOMContentLoaded", function () {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');

    // تنقل بين الأقسام
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            document.getElementById(button.dataset.section).classList.add('active');
            button.classList.add('active');
        });
    });

    // المسبحة الإلكترونية
    const tasbihCounter = document.getElementById('score');
    const tasbihCircle = document.getElementById('circle');
    const resetTasbihBtn = document.getElementById('reset-tasbih');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    let countValue = 0;
    let currentTasbihText = 'سبح';
    
    // دالة العد
    function count() {
        countValue++;
        tasbihCounter.textContent = countValue;
        
        // إضافة تأثير حركي عند النقر
        tasbihCircle.classList.add('clicked');
        setTimeout(() => {
            tasbihCircle.classList.remove('clicked');
        }, 150);
    }
    
    // إضافة حدث النقر للمسبحة
    tasbihCircle.addEventListener('click', count);
    
    // إعادة تعيين العداد
    resetTasbihBtn.addEventListener('click', function() {
        countValue = 0;
        tasbihCounter.textContent = countValue;
        
        // إضافة تأثير حركي عند إعادة التعيين
        tasbihCounter.classList.add('reset');
        setTimeout(() => {
            tasbihCounter.classList.remove('reset');
        }, 300);
    });
    
    // تغيير نص المسبحة عند اختيار تسبيحة
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.text;
            tasbihCircle.textContent = text;
            currentTasbihText = text;
            
            // إضافة الفئة النشطة للزر المحدد
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // إعادة تعيين العداد
            countValue = 0;
            tasbihCounter.textContent = countValue;
        });
    });
    
    // إضافة دعم لوحة المفاتيح للمسبحة
    document.addEventListener('keydown', function(e) {
        // استخدام مفتاح المسافة أو Enter للعد
        if ((e.key === ' ' || e.key === 'Enter') && document.getElementById('tasbih-section').classList.contains('active')) {
            count();
            e.preventDefault(); // منع التمرير عند الضغط على المسافة
        }
    });
    
    // إضافة CSS للتأثيرات الحركية للمسبحة
    const tasbihStyle = document.createElement('style');
    tasbihStyle.textContent = `
        #circle.clicked {
            transform: scale(0.95);
            box-shadow: 0 0 30px rgba(243, 156, 18, 0.9);
        }
        
        #score.reset {
            animation: fadeOut 0.3s;
        }
        
        @keyframes fadeOut {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        .preset-btn.active {
            background: var(--accent-color);
            color: white;
        }
    `;
    document.head.appendChild(tasbihStyle);

    // الأذكار
    const azkarData = {
    morning: [
        "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
        "اللهم إني أسألك خير هذا اليوم فتحه، ونصره، ونوره، وبركته، وهداه، وأعوذ بك من شر ما فيه وشر ما بعده.",
        "اللهم أنت ربي، لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
        "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
        "اللهم بك أصبحنا، وبك نحيا، وبك نموت، وإليك النشور.",
        "اللهم إني أصبحت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك أنك أنت الله، لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (ثلاث مرات).",
        "اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر، لا إله إلا أنت.",
        "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت.",
        "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً ورسولاً (ثلاث مرات).",
        "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (ثلاث مرات).",
        "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم (سبع مرات).",
        "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
        "اللهم إني أسألك خير هذا اليوم وخير ما فيه، وأعوذ بك من شر هذا اليوم وشر ما فيه."
    ],
    evening: [
        "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
        "اللهم إني أسألك خير هذه الليلة فتحها، ونصرها، ونورها، وبركتها، وهداها، وأعوذ بك من شر ما فيها وشر ما بعدها.",
        "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
        "اللهم بك أمسينا، وبك نحيا، وبك نموت، وإليك المصير.",
        "اللهم إني أمسيت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك أنك أنت الله، لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (ثلاث مرات).",
        "سبحان الله وبحمده (مائة مرة).",
        "اللهم اجعل لي في قلبي نوراً، وفي لساني نوراً، وفي سمعي نوراً، وفي بصري نوراً، ومن فوقي نوراً، ومن تحتي نوراً، وعن يميني نوراً، وعن شمالي نوراً، ومن أمامي نوراً، ومن خلفي نوراً، واجعل لي نوراً.",
        "اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، رب كل شيء ومليكه، أشهد أن لا إله إلا أنت، أعوذ بك من شر نفسي ومن شر الشيطان وشركه.",
        "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم (سبع مرات)."
    ],
    sleep: [
        "باسمك ربي وضعت جنبي، وبك أرفعه، فإن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين.",
        "اللهم قني عذابك يوم تبعث عبادك.",
        "اللهم باسمك أموت وأحيا.",
        "اللهم إني أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك، وألجأت ظهري إليك، رغبةً ورهبةً إليك، لا ملجأ ولا منجى منك إلا إليك.",
        "اللهم اغفر لي ذنبي، واستر عورتي، وأمن روعتي، واحفظني من بين يدي ومن خلفي، وعن يميني وعن شمالي، وأعوذ بعظمتك أن أغتال من تحتي.",
        "سبحان الله (33 مرة)، الحمد لله (33 مرة)، الله أكبر (34 مرة)."
    ],
    duas: [
        "اللهم اجعل القرآن ربيع قلبي، ونور صدري، وجلاء حزني، وذهاب همي.",
        "اللهم إني أسألك من الخير كله عاجله وآجله، ما علمت منه وما لم أعلم.",
        "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين وغلبة الرجال.",
        "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك.",
        "اللهم اغفر لي، واهدني، وارزقني، وعافني.",
        "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي.",
        "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
        "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل، وأعوذ بك من النار وما قرب إليها من قول أو عمل.",
        "اللهم ارزقني حبك، وحب من يحبك، وحب عمل يقربني إلى حبك.",
        "اللهم صل وسلم وبارك على سيدنا محمد وعلى آله وصحبه أجمعين."
    ]
};

    // أزرار الأذكار
    const azkarBtns = document.querySelectorAll('.azkar-btn');
    
    azkarBtns.forEach(button => {
        button.addEventListener('click', function () {
            azkarBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const type = this.dataset.type;
            const content = azkarData[type].map(dhikr => `<p>${dhikr}</p>`).join("");
            document.getElementById('azkar-content').innerHTML = content;
        });
    });

    // عرض أذكار الصباح افتراضيًا
    document.getElementById('azkar-content').innerHTML = azkarData.morning.map(dhikr => `<p>${dhikr}</p>`).join("");
    
    // تفعيل أول زر في قسم الأذكار
    if (azkarBtns.length > 0) {
        azkarBtns[0].classList.add('active');
    }
});
