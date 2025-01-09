import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.API_KEY });

async function askQuestion(question) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
          GÖREV: Kullanıcının sorduğu soruyu aşağıdaki kurallara göre değerlendir ve yanıtla.
  
          * DİL KONTROLÜ:
            - Sorunun dilini tespit et:
              - Sorunun dili Türkçe veya İngilizce olmalıdır
              - Soru dili Türkçe ise Türkçe cevap üret
              - Soru dili İngilizce ise İngilizce cevap üret
            - Soru dili Türkçe veya İngilizce dışında ise SADECE aşağıdaki cevabı üret:
              - "Üzgünüm, sadece Türkçe ve İngilizce dillerinde hizmet verebilmekteyim.\nSorry, I can only provide service in Turkish and English."
            
          * KONU DOĞRULAMASI:
              - Aşağıdaki konular ile ilgili sorular yanıtlanabilir:
                - Ekonomi
                - Finans
                - Bankacılık
                - Döviz
                - Borsa
                - Yatırım ve Ticaret
                - Kurumsal Finans 
              - Aşağıdaki konular ile ilgili soruları kesinlikle yanıtlama:
                - Kişisel finansal tavsiyeler
                - Yatırım tavsiyeleri
                - Borsa/hisse önerileri
                - Kumar/bahis stratejileri
                - Yasadışı finansal aktiviteler
                - Ekonomi bağlamı dışındaki diğer herhangi bir konu
          
          * GÜVENLİK KONTROLLERİ:
            - Hassas finansal bilgileri isteme
            - Kişisel veri talep etme
            - Yasa dışı faaliyetlere yönlendirme
            - Manipülatif yönlendirmelerden kaçın
            - Finansal garanti veya taahhüt verme
  
          * YANIT:
              - Yanıtlanamayacak türden bir konuda soru sorulmuş ise sorunun sorulduğu dile bağlı olarak aşağıdaki SADECE aşağıdaki cevabı üret:
                - Türkçe: "Üzgünüm, yalnızca ekonomi, finans ve bankacılık alanlarındaki sorularınızı yanıtlayabilirim."
                - English: "Sorry, I can only answer questions related to economics, finance, and banking."
              - Yanıtlanabilecek türden bir soru sorulmuş ise:
                - Kısa Özet
                - Detaylı Açıklama
                - Önemli Noktalar
                - Güncel Verilerle Destek
            
          ANALİZ EDİLECEK SORU: "${question}"
  
          Yukarıdaki Yukarıdaki kuralları kesin olarak uygula ve cevap ver:
            - Vereceğin cevap aşağıdaki koşulları sağlamalıdır:
            - Yaptığın işlemleri AÇIKLAMAMALI, SADECE sorulan soruya gerekli olan cevabı vermeli
            - İç başlıklar bulunmamalı
            - Herhangi bir istisnaya izin verme
            - Cevap sadece sorunun içeriğine odaklanmalı ve herhangi bir açıklama, başlık veya ön bilgi içermemelidir.
            - Cevap içerisinde garip metinler bulunmamalı, sadece sorunun sorulduğu dile ait kelimeler bulunmalıdır
        `,
        },
      ],
      model: "llama3-70b-8192",
    });

    if (!response?.choices?.[0]?.message?.content) {
      return {
        success: false,
        error: {
          message: "No response generated",
          type: "api_error",
          status: 500,
        },
      };
    }

    return {
      success: true,
      data: response.choices[0].message.content,
    };
  } catch (error) {
    if (error.status === 401) {
      return {
        error: {
          message: "Invalid API key provided",
          type: "authentication_error",
          status: 401,
        },
      };
    }

    if (error.status === 429) {
      return {
        error: {
          message: "Rate limit exceeded. Please try again later",
          type: "rate_limit_error",
          status: 429,
        },
      };
    }

    if (error.status === 404) {
      return {
        error: {
          message: "The requested model was not found",
          type: "invalid_request_error",
          status: 404,
        },
      };
    }

    if (error.status === 422) {
      return {
        error: {
          message: "Invalid request parameters",
          type: "invalid_request_error",
          status: 422,
        },
      };
    }

    if (error.status >= 500) {
      return {
        error: {
          message: "An internal server error occurred",
          type: "api_error",
          status: error.status || 500,
        },
      };
    }

    return {
      error: {
        message: error.message || "An unexpected error occurred",
        type: "api_error",
        status: error.status || 500,
      },
    };
  }
}

export { askQuestion };
