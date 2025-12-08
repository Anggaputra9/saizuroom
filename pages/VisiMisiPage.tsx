import React from 'react';

const VisiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const MisiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);


const VisiMisiPage: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-12">
        <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-saizu-blue dark:text-blue-300 mb-2">Visi & Misi</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Landasan dan Arah Tujuan UIN SAIZU</p>
        </div>
      
      <div className="space-y-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl animate-slide-in-up opacity-0 border border-transparent dark:border-gray-700" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4 mb-4">
              <div className="bg-saizu-blue p-3 rounded-full">
                <VisiIcon/>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Visi</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg pl-16">
            "Menjadi universitas Islam yang unggul dan terkemuka dalam integrasi keilmuan, keislaman, dan keindonesiaan di tingkat global pada tahun 2045."
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl animate-slide-in-up opacity-0 border border-transparent dark:border-gray-700" style={{ animationDelay: '250ms' }}>
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-saizu-green p-3 rounded-full">
                <MisiIcon/>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Misi</h2>
          </div>
          <ul className="list-decimal list-outside text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed text-lg ml-20">
            <li>Menyelenggarakan pendidikan tinggi yang mengintegrasikan ilmu pengetahuan, teknologi, dan seni dengan nilai-nilai keislaman dan keindonesiaan.</li>
            <li>Mengembangkan penelitian inovatif dan relevan yang memberikan kontribusi pada pengembangan ilmu pengetahuan dan kesejahteraan masyarakat.</li>
            <li>Melaksanakan pengabdian kepada masyarakat berbasis riset untuk pemberdayaan dan pencerahan.</li>
            <li>Membangun peradaban yang berlandaskan nilai-nilai Islam rahmatan lil 'alamin dalam bingkai Negara Kesatuan Republik Indonesia.</li>
            <li>Mengembangkan kerjasama strategis dengan berbagai lembaga di tingkat nasional dan internasional untuk penguatan institusi.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisiMisiPage;
