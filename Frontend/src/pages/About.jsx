import React from "react";

const About = () => {
  return (
    <section className="pm-16">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          من نحن
        </h1>
        <p className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-900 to-purple-600 py-10">
          نحن في Beta Medical نفخر بتقديم حلول طبية متقدمة من خلال شراكتنا
          الحصرية مع أبرز العلامات التجارية العالمية. من خلال متجرنا الإلكتروني،
          نوفر لعملائنا تجربة شراء مريحة، تضمن حصولهم على منتجات معتمدة بسرعة
          وسهولة. ملتزمون بتلبية احتياجاتكم بأعلى معايير الجودة والدقة.
        </p>
        <ul className="list-disc text-2xl text-blue-600 dark:text-gray-300">
          <li>شراكات حصرية مع علامات تجارية موثوقة عالميًا.</li>
          <li>التزام دائم بتقديم حلول طبية دقيقة وعالية الجودة.</li>
          <li>دعم العملاء في اتخاذ قرارات مدروسة عبر استشارات مهنية.</li>
          <li>منتجات معتمدة حاصلة على شهادات الجودة العالمية.</li>
          <li>توفير اختبارات سريعة ومضادات حيوية موثوقة.</li>
          <li>فريق عمل مدرب جاهز للإجابة على استفساراتكم.</li>
          <li>تجربة شراء سلسة وتفاعل مريح عبر منصاتنا الإلكترونية.</li>
          <li>تحديث مستمر لمنتجاتنا لتواكب احتياجات السوق الطبية.</li>
        </ul>
      </div>
    </section>
  );
};

export default About;
