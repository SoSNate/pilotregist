import { useState } from 'react';
import {
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  Brain, 
  Target, 
  Users, 
  TrendingUp,
  GraduationCap,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  User
} from 'lucide-react';

/**
 * TutorLandingPage — דף נחיתה ממוקד למורים פרטיים ומורים למתמטיקה.
 * מציג הסבר קצר וישיר על מערכת חשבונאוטיקה + טופס הרשמה מהיר (מייל וטלפון).
 *
 * ⚠️ קוד מת (מוקפא) — נשמר לשימוש עתידי אפשרי בלבד.
 *  • לא מיובא מ-src, אין לו ראוט, ואינו נכלל ב-build (הכניסה היחידה של vite היא index.html בשורש).
 *  • החיבור ל-Supabase נותק: הטופס אינו כותב יותר לטבלת teacher_leads ואינו מזין את דשבורד האדמין.
 *  לפני החייאה: להחזיר יעד שמירה מפורש ולוודא שהוא מאושר.
 */
export default function TutorLandingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    studentCount: '1-5',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('אנא הזן שם מלא');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('אנא הזן מספר טלפון ליצירת קשר');
      return;
    }

    setLoading(true);
    try {
      // הכתיבה ל-Supabase (teacher_leads → דשבורד האדמין) הוסרה בכוונה.
      // הדף מוקפא ואינו שומר שום נתון בשום מקום; הטופס מציג אישור בלבד.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Brain className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                חשבונאוטיקה
              </span>
              <span className="text-xs text-emerald-400/90 block font-semibold">למורים פרטיים וצוותי חינוך</span>
            </div>
          </div>

          <a
            href="#join-form"
            className="px-4 py-2 text-sm font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl transition flex items-center gap-2"
          >
            <span>הרשמה לניסיון</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4">
        {/* Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Messaging (Column 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>מערכת האבחון והתרגול המתקדמת בישראל</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              הפוך כל תלמיד ל-<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                מאסטר בחשבון
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
              מערכת אבחון חכמה, משחקי חקר ויזואליים ודשבורד מעקב בזמן אמת – שתוכננו במיוחד עבור מורים פרטיים שרוצים להשיג תוצאות מדהימות ולחסוך שעות של הכנת חומרים.
            </p>

            {/* Value Bullet Points */}
            <div className="space-y-3 pt-2">
              {[
                'זיהוי מדויק בזמן אמת מתי התלמיד תקוע, מתוסכל או מנחש',
                'מעל 10 משחקי עומק פדגוגיים שחליפים דפי עבודה משעממים',
                'דו"חות התקדמות מרשימים להורים בלחיצת כפתור אחת',
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 font-medium">תואם תכנית הלימודים</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                <div className="text-2xl font-black text-cyan-400">10+</div>
                <div className="text-xs text-slate-400 font-medium">משחקי עומק לימודיים</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                <div className="text-2xl font-black text-teal-300">0 ש"ח</div>
                <div className="text-xs text-slate-400 font-medium">הרשמה לגרסת ניסיון</div>
              </div>
            </div>

          </div>

          {/* Registration Form Card (Column 8-12) */}
          <div id="join-form" className="lg:col-span-5 scroll-mt-24">
            <div className="relative bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Card Header */}
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-100">הרשמה לגישת מורים</h2>
                <p className="text-xs text-slate-400">
                  השאר פרטים וקבל גישת ניסיון מלאה למערכת והנחיות הפעלה
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/50 rounded-full mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-300">ההרשמה התקבלה בהצלחה!</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    תודה שנרשמת. נציג צוות חשבונאוטיקה יצור איתך קשר בטלפון/בוואטסאפ בהקדם לקבלת קוד המורה האישי שלך.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-400 underline hover:text-emerald-300"
                  >
                    הרשם שוב עם פרטים אחרים
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>שם מלא</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="ישראל ישראלי"
                      required
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-sm transition"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>מספר טלפון / נייד</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="050-0000000"
                      required
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-sm transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                      <span>כתובת דוא"ל</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="teacher@example.com"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 text-sm transition"
                    />
                  </div>

                  {/* Number of students */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>כמות תלמידים פעילה</span>
                    </label>
                    <select
                      name="studentCount"
                      value={formData.studentCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm transition"
                    >
                      <option value="1-5">1-5 תלמידים (מורה פרטי)</option>
                      <option value="6-15">6-15 תלמידים (קבוצות קטנות)</option>
                      <option value="16-30">16-30 תלמידים (כיתה)</option>
                      <option value="30+">מעל 30 תלמידים (מרכז למידה / בית ספר)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-base shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span>שולח...</span>
                    ) : (
                      <>
                        <span>קבלת גישת מורה עכשיו</span>
                        <Send className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    🔒 הפרטים שלך שמורים ולא יועברו לאף גורם שלישי.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ── 3 Key Feature Pillars Section ── */}
      <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-slate-100">
              למה מורים פרטיים בוחרים בחשבונאוטיקה?
            </h2>
            <p className="text-slate-400 text-sm">
              שילוב ייחודי בין אבחון פדגוגי עמוק לבין משחקיות שמושכת את הילדים לתרגל
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">1. אבחון קשיים בזמן אמת</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                המערכת מזהה ניחושים מהירים, תסכול או תפיסות מוטעות (כמו אשליית אורך המספר בשברים עשרוניים) עוד לפני שהתלמיד מגיע אליך לשיעור.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-cyan-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">2. משחקי חקר ויזואליים</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                במקום דפי עבודה משעממים – מעל 10 משחקי עומק (שברים, אחוזים, מאזניים, גאומטריה ומשוואות) המפתחים ראייה מתמטית עמוקה.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-teal-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">3. דוח הורים מרשים</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                הפקת נתונים וגרפים בלחיצת כפתור שמראים להורים את השיפור המדויק באחוזי ההצלחה ובזמני התרגול של הילד.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} חשבונאוטיקה - כל הזכויות שמורות</div>
          <div className="flex gap-4 text-slate-400">
            <a href="/privacy" className="hover:text-emerald-400">מדיניות פרטיות</a>
            <a href="/terms" className="hover:text-emerald-400">תנאי שימוש</a>
            <a href="/accessibility" className="hover:text-emerald-400">נגישות</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
