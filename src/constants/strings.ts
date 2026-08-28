export const STRINGS = {
  appName: 'رحيق',
  appNameFull: 'رحيق | Raheeq',
  appTagline: 'رفيقك اليومي للذكر والعبادة',
  
  // Auth & Splash
  welcome: 'مرحباً بك',
  welcomeSub: 'سجّل دخولك لحفظ ومزامنة إنجازاتك وأورادك اليومية بأمان وسهولة.',
  googleSignIn: 'تسجيل الدخول عبر Google',
  googleSignInHint: 'تسجيل دخول آمن وسريع بضغطة زر',
  privacyPolicyNotice: 'بالتسجيل، أنت توافق على سياسة الخصوصية وشروط الاستخدام',
  privacyPolicyLink: 'سياسة الخصوصية والأمان',
  
  // Privacy Policy Verbatim Text
  privacyPolicyModalTitle: 'سياسة الخصوصية',
  privacyPolicyBody: 'نحن في التطبيق نؤمن بأن راحتك وخصوصيتك هما الأساس. نود إعلامك بكل شفافية أن تطبيقنا لا يطلب مطلقاً أي أذونات حساسة؛ فلا نطلب إذن الوصول إلى موقعك الجغرافي، ولا نطلب صلاحية الدخول إلى استوديو الصور أو الملفات، ولا نطلب أي وصول إلى الميكروفون أو التسجيل الصوتي. بيانات حسابك تستخدم فقط لتأمين وتخزين إنجازاتك اليومية بكل أمان، وراحة بالك هي غايتنا.',
  close: 'إغلاق',
  agreeAndContinue: 'فهمت وموافق',

  // Gender Selection Modal
  genderModalTitle: 'تخصيص البروفايل',
  genderModalSubtitle: 'اختر الجنس لتخصيص رمز حسابك التعبيري ومظهرك:',
  genderMale: 'ذكر',
  genderFemale: 'أنثى',
  saveAndStart: 'حفظ والبدء',
  skipOptional: 'تخطي الآن',

  // Navigation Tabs
  tabHome: 'الرئيسية',
  tabAdhkar: 'الأذكار',
  tabTasbeeh: 'التسبيح',
  tabHistory: 'الإنجازات',
  tabSettings: 'الإعدادات',

  // Home Screen
  dailyTimelineTitle: 'شريط الإنجاز اليومي',
  dailyTimelineSubtitle: 'أورادك وصلواتك مرتبة زمنياً طوال اليوم',
  dailyProgress: 'نسبة إنجاز اليوم',
  progressRemaining: 'متبقي لك اليوم',
  allCompletedTitle: 'ما شاء الله! أتممت جميع أوراد اليوم بنجاح ✨',
  allCompletedSubtitle: 'كتب الله أجرك وثبتك على طاعته',
  tasksCompletedOf: (completed: number, total: number) => `${completed} من ${total}`,
  ksaTimeLabel: 'توقيت مكة المكرمة (UTC+3)',
  autoResetNotice: 'يتم حفظ الإنجاز وتصفير الأوراد تلقائياً عند منتصف الليل 00:00',

  // Adhkar Screen
  morningAdhkarTitle: 'أذكار الصباح',
  eveningAdhkarTitle: 'أذكار المساء',
  completedCount: 'تم الإنجاز',
  resetAdhkar: 'إعادة العدادات',
  repeatCount: (count: number) => `التكرار: ${count}`,
  remainingTaps: (count: number) => `المتبقي: ${count}`,

  // Tasbeeh Focus Counter
  tasbeehTitle: 'عداد دقيقة التسبيح',
  tasbeehSubtitle: 'دقيقة كاملة من الخشوع والذكر المستمر',
  tapToCount: 'اضغط للذكر',
  startMinute: 'بدء الدقيقة',
  resetCounter: 'تصفير العداد',
  tasbeehCompletedMessage: 'أحسنت! أتممت دقيقة التسبيح بنجاح وتم تسجيل إنجازك اليومي 🌿',
  minuteRemaining: 'الوقت المتبقي',
  totalTasbeehCount: 'مجموع التسبيحات',

  // History & Streak Screen
  streakTitle: 'سجل الإنجاز والمواظبة',
  currentStreak: 'أيام متتالية',
  perfectDays: 'أيام كاملة (100%)',
  totalCompletedTasks: 'مجموع المهام المنجزة',
  historyListTitle: 'مشوار الأيام السابقة',
  emptyHistory: 'لا توجد سجلات سابقة بعد. أكمل أوراد اليوم لتسجيل أول يوم في مشوارك!',
  dayRecordTitle: (dayNumber: number, dateStr: string, percentage: number) =>
    `اليوم رقم ${dayNumber} - ${dateStr} - نسبة الإنجاز ${percentage}%`,

  // Settings & Profile
  settingsTitle: 'الإعدادات',
  profileSection: 'الملف الشخصي',
  nameLabel: 'الاسم',
  genderLabel: 'الجنس',
  appearanceSection: 'المظهر والسمة',
  darkModeLabel: 'الوضع الليلي (Dark Mode)',
  darkModeSub: 'تبديل المظهر بين الوضع الصباحي والليلي',
  connectSection: 'تواصل معنا',
  instagramLabel: 'حسابنا على انستغرام',
  instagramSub: '@raheeq.app',
  telegramLabel: 'انضم لقناتنا على تيليجرام',
  telegramSub: 'قناة رحيق الرسمية للأدعية والفوائد',
  aboutAppLabel: 'من نحن؟',
  aboutAppSub: 'نبذة ورسالة تطبيق رحيق',
  signOutLabel: 'تسجيل الخروج',
  signOutConfirmTitle: 'تسجيل الخروج',
  signOutConfirmMessage: 'هل أنت متأكد من رغبتك في تسجيل الخروج؟ سيتم حفظ إنجازاتك بأمان.',
  cancel: 'إلغاء',
  confirmSignOut: 'خروج',

  // About Screen Verbatim
  aboutScreenHeader: 'من نحن؟',
  aboutScreenBody: 'نحن رحيق، تطبيق مجاني بلا هدف وخالي من الإعلانات، مقصدنا الوحيد هو أن نحصل على حسنة جارية منك. شكراً لتحميلك تطبيقنا',
  aboutScreenTeam: 'فريق رحيق',

  // Links
  instagramUrl: 'https://www.instagram.com/raheeq.app/',
  telegramUrl: 'https://t.me/rahee_app',
};

export const DAILY_TASKS_DATA = [
  {
    id: 'fajr_prayer',
    order: 1,
    title: 'صلاة الفجر',
    iconName: 'weather-sunset-up',
    description: 'أداء فريضة الفجر وسنتها',
    category: 'prayer',
  },
  {
    id: 'quran_reading',
    order: 2,
    title: 'ورد القرآن (صفحتين)',
    iconName: 'book-open-page-variant-outline',
    description: 'قراءة صفحتين بتدبر من كتاب الله',
    category: 'quran',
  },
  {
    id: 'morning_adhkar',
    order: 3,
    title: 'أذكار الصباح',
    iconName: 'weather-sunny',
    description: 'حصن المسلم لأول النهار',
    category: 'adhkar',
  },
  {
    id: 'dhuhr_prayer',
    order: 4,
    title: 'صلاة الظهر',
    iconName: 'white-balance-sunny',
    description: 'أداء فريضة الظهر وسننها',
    category: 'prayer',
  },
  {
    id: 'asr_prayer',
    order: 5,
    title: 'صلاة العصر',
    iconName: 'weather-partly-cloudy',
    description: 'أداء فريضة الصلاة الوسطى',
    category: 'prayer',
  },
  {
    id: 'maghrib_prayer',
    order: 6,
    title: 'صلاة المغرب',
    iconName: 'weather-sunset-down',
    description: 'أداء فريضة المغرب وسنتها',
    category: 'prayer',
  },
  {
    id: 'evening_adhkar',
    order: 7,
    title: 'أذكار المساء',
    iconName: 'weather-night',
    description: 'حصن المسلم لآخر النهار',
    category: 'adhkar',
  },
  {
    id: 'isha_prayer',
    order: 8,
    title: 'صلاة العشاء',
    iconName: 'moon-waning-crescent',
    description: 'أداء فريضة العشاء والشفع والوتر',
    category: 'prayer',
  },
  {
    id: 'tasbeeh_minute',
    order: 9,
    title: 'تسبيح لمدة دقيقة',
    iconName: 'clock-time-three-outline',
    description: 'دقيقة ذكر واستغفار بخشوع',
    category: 'tasbeeh',
  },
] as const;
