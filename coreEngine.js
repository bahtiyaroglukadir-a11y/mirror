// coreEngine.js
// Mirror – Decision Frame Core Engine
// Dil: Türkçe
// Amaç: Karar düşüncesini varsayım / risk / alternatif ekseninde yapılandırmak

function extractAssumptions(text) {
  const assumptions = [];

  if (/yapmalıyım|zorundayım|başka yol yok/i.test(text)) {
    assumptions.push(
      "Kararın zorunlu olduğu ve başka seçenek olmadığı varsayılıyor."
    );
  }

  if (/herkes|kesin|daima|asla/i.test(text)) {
    assumptions.push(
      "Durumun mutlak ve değişmez olduğu varsayılıyor."
    );
  }

  if (/geç kaldım|çok geç/i.test(text)) {
    assumptions.push(
      "Zamanın kritik biçimde aşıldığı varsayılıyor."
    );
  }

  if (assumptions.length === 0) {
    assumptions.push(
      "Metinde açık bir varsayım net biçimde görünmüyor."
    );
  }

  return assumptions;
}

function identifyRisks(text) {
  const risks = [];

  if (/hata|yanlış/i.test(text)) {
    risks.push(
      "Yanlış bir karar alma riski bulunuyor."
    );
  }

  if (/pişman|kayb/i.test(text)) {
    risks.push(
      "Sonradan pişmanlık veya kayıp yaşanabilir."
    );
  }

  if (/acele|hemen/i.test(text)) {
    risks.push(
      "Acele karar vermek uzun vadeli sonuçları zayıflatabilir."
    );
  }

  if (risks.length === 0) {
    risks.push(
      "Belirgin bir risk ifadesi tespit edilmedi."
    );
  }

  return risks;
}

function generateAlternatives(text) {
  const alternatives = [];

  alternatives.push(
    "Kararı hemen vermek yerine küçük ve geri alınabilir bir adım atmak."
  );

  alternatives.push(
    "Mevcut seçenekleri yeniden tanımlayıp eksik olanları aramak."
  );

  if (/bekle/i.test(text)) {
    alternatives.push(
      "Belirli bir süre bekleyip yeni bilgi toplamak."
    );
  }

  return alternatives;
}

function buildSummary(assumptions, risks, alternatives) {
  if (assumptions.length === 1 && risks.length === 1) {
    return (
      "Bu düşünce açık bir acele içermiyor ancak bazı varsayımlar ve riskler mevcut. " +
      "Alternatifler değerlendirildiğinde karar alanı biraz daha netleşebilir."
    );
  }

  return (
    "Bu düşünce birden fazla varsayım ve risk içeriyor. " +
    "Alternatifler birlikte ele alındığında kararın yapısı daha bilinçli hale gelebilir."
  );
}

function handleInput({ text, session_id, history }) {
  const assumptions = extractAssumptions(text);
  const risks = identifyRisks(text);
  const alternatives = generateAlternatives(text);

  return {
    type: "decision-frame",
    summary: buildSummary(assumptions, risks, alternatives),
    structured: {
      assumptions,
      risks,
      alternatives
    },
    readable: buildSummary(assumptions, risks, alternatives)
  };
}

module.exports = { handleInput };
