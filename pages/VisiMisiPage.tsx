import React from 'react';

const VisiMisiPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-saizu-blue mb-6 border-b-4 border-saizu-green pb-2">Visi & Misi</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Visi</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            "Menjadi universitas Islam yang unggul dan terkemuka dalam integrasi keilmuan, keislaman, dan keindonesiaan di tingkat global pada tahun 2045."
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Misi</h2>
          <ul className="list-decimal list-inside text-gray-700 space-y-3 leading-relaxed">
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
