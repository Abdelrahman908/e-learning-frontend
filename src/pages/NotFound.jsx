import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, GraduationCap, HelpCircle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] dark:from-[#0c1a32] dark:to-[#1a365d] px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200/70 dark:border-gray-700/50 transition-all duration-300 hover:shadow-3xl">
          
          {/* Decorative Elements */}
          <GraduationCap className="absolute -left-16 -top-16 w-40 h-40 text-blue-100/40 dark:text-blue-900/20 rotate-12 opacity-60" />
          <BookOpen className="absolute -right-16 -bottom-16 w-40 h-40 text-blue-100/40 dark:text-blue-900/20 -rotate-12 opacity-60" />
          
          {/* Content */}
          <div className="p-8 md:p-12 text-center relative z-10">
            
            {/* Icon Section */}
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-900/20 rounded-full animate-pulse"></div>
                <div className="w-36 h-36 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-full flex items-center justify-center border-2 border-blue-200/70 dark:border-blue-900/30 shadow-lg">
                  <GraduationCap className="w-20 h-20 text-blue-600 dark:text-blue-400" strokeWidth={1.4} />
                </div>
                <span className="absolute -top-4 -right-4 bg-blue-600 text-white text-base font-bold px-4 py-1.5 rounded-full shadow-lg animate-bounce">
                  404
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div className="mb-12 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  الصفحة غير موجودة
                </span>
              </h1>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  عذرًا، لا يمكننا العثور على الدرس أو الصفحة المطلوبة. ربما تكون قد أخطأت في الرابط أو أن المحتوى لم يعد متاحًا.
                </p>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                  يمكنك البدء باكتشاف دوراتنا التعليمية الجديدة
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                onClick={() => navigate('/')}
                className="h-14 px-8 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all transform hover:-translate-y-1"
              >
                <Home className="mr-3 h-5 w-5" />
                الصفحة الرئيسية
              </Button>
              
              <Button
                onClick={() => navigate('/courses')}
                variant="secondary"
                className="h-14 px-8 text-lg font-medium bg-white hover:bg-gray-50 text-blue-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-400 border border-blue-200 dark:border-gray-700 shadow-lg transition-all transform hover:-translate-y-1"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                اكتشف الكورسات
              </Button>
            </div>

            {/* Support Section */}
            <div className="mt-16 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-full">
                <HelpCircle className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                تحتاج مساعدة؟{' '}
                <a 
                  href="/support" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;